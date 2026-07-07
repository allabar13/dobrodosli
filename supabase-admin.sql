-- ═══════════════════════════════════════════════════════════════════════
-- «Добродошли» · админка, события, промокоды, начисления безлимита
-- Выполнить ОДИН РАЗ: Supabase → SQL Editor → New query → вставить → Run.
-- Повторный запуск безопасен (все команды идемпотентны).
-- ═══════════════════════════════════════════════════════════════════════

-- ── Кто админ ─────────────────────────────────────────────────────────
create table if not exists admins (email text primary key);
insert into admins (email) values ('a.barashchuk@gmail.com') on conflict do nothing;

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from admins where lower(email) = lower(coalesce(auth.jwt()->>'email', ''))) $$;

-- ── События продукта (анонимные, без персональных данных) ─────────────
create table if not exists events (
  id bigint generated always as identity primary key,
  device_id uuid not null,
  platform text not null check (platform in ('web','ios')),
  event text not null check (char_length(event) <= 40),
  props jsonb not null default '{}'::jsonb check (pg_column_size(props) <= 2048),
  created_at timestamptz not null default now()
);
create index if not exists events_created_idx on events (created_at);
create index if not exists events_event_idx on events (event, created_at);
alter table events enable row level security;

drop policy if exists events_insert_all on events;
create policy events_insert_all on events
  for insert to anon, authenticated with check (true);
drop policy if exists events_admin_read on events;
create policy events_admin_read on events
  for select to authenticated using (is_admin());

-- ── Промокоды ──────────────────────────────────────────────────────────
create table if not exists promo_codes (
  code text primary key check (code = upper(code) and char_length(code) between 4 and 24),
  days int not null default 3 check (days between 1 and 365),
  max_uses int not null default 100 check (max_uses between 1 and 100000),
  used_count int not null default 0,
  note text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table promo_codes enable row level security;
drop policy if exists promo_admin_all on promo_codes;
create policy promo_admin_all on promo_codes
  for all to authenticated using (is_admin()) with check (is_admin());

create table if not exists promo_redemptions (
  id bigint generated always as identity primary key,
  code text not null references promo_codes (code),
  device_id uuid not null,
  redeemed_at timestamptz not null default now(),
  unique (code, device_id)
);
alter table promo_redemptions enable row level security;
drop policy if exists redemptions_admin_read on promo_redemptions;
create policy redemptions_admin_read on promo_redemptions
  for select to authenticated using (is_admin());

-- Погашение кода устройством. Вся проверка и учёт — одной транзакцией.
create or replace function redeem_promo(p_code text, p_device uuid)
returns int language plpgsql security definer set search_path = public as $$
declare
  v_days int;
begin
  -- атомарно занимаем одно использование (блокировка строки сериализует гонки)
  update promo_codes
     set used_count = used_count + 1
   where code = upper(trim(p_code)) and active and used_count < max_uses
  returning days into v_days;

  if v_days is null then
    if exists (select 1 from promo_codes where code = upper(trim(p_code)) and active) then
      raise exception 'promo_exhausted';
    end if;
    raise exception 'promo_not_found';
  end if;

  begin
    insert into promo_redemptions (code, device_id) values (upper(trim(p_code)), p_device);
  exception when unique_violation then
    raise exception 'promo_already_redeemed'; -- откатит и занятое использование
  end;

  return v_days;
end $$;
revoke all on function redeem_promo(text, uuid) from public;
grant execute on function redeem_promo(text, uuid) to anon, authenticated;

-- ── Начисление дней конкретному юзеру по email (для вошедших) ─────────
create table if not exists premium_grants (
  id bigint generated always as identity primary key,
  email text not null check (char_length(email) between 3 and 200),
  days int not null check (days between 1 and 365),
  note text not null default '',
  created_at timestamptz not null default now(),
  claimed_by uuid,
  claimed_at timestamptz
);
create index if not exists grants_email_idx on premium_grants (lower(email)) where claimed_at is null;
alter table premium_grants enable row level security;
drop policy if exists grants_admin_all on premium_grants;
create policy grants_admin_all on premium_grants
  for all to authenticated using (is_admin()) with check (is_admin());

-- Приложение вызывает после входа: забирает все неполученные начисления.
create or replace function claim_grants()
returns int language plpgsql security definer set search_path = public as $$
declare
  v_total int;
begin
  if auth.uid() is null then return 0; end if;
  with claimed as (
    update premium_grants
       set claimed_by = auth.uid(), claimed_at = now()
     where lower(email) = lower(coalesce(auth.jwt()->>'email', ''))
       and claimed_at is null
    returning days
  )
  select coalesce(sum(days), 0) into v_total from claimed;
  return v_total;
end $$;
revoke all on function claim_grants() from public;
grant execute on function claim_grants() to authenticated;

-- ── Сводка для админки: метрики и воронка одним вызовом ───────────────
create or replace function admin_stats(p_days int default 14)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_from timestamptz := now() - make_interval(days => greatest(1, least(p_days, 365)));
  v jsonb;
begin
  if not is_admin() then raise exception 'forbidden'; end if;

  select jsonb_build_object(
    'period_days', p_days,
    'devices_total',   (select count(distinct device_id) from events),
    'devices_new',     (select count(distinct device_id) from events e
                         where not exists (select 1 from events p
                           where p.device_id = e.device_id and p.created_at < v_from)),
    'devices_active',  (select count(distinct device_id) from events where created_at >= v_from),
    'cloud_users',     (select count(*) from progress),
    'funnel', (
      select coalesce(jsonb_object_agg(t.event, t.n), '{}'::jsonb) from (
        select event, count(distinct device_id) as n
          from events
         where created_at >= v_from
           and event in ('app_open','onboarding_done','lesson_start','lesson_done',
                         'paywall_shown','purchase_tap','purchase_done','share_bonus','promo_redeemed')
         group by event
      ) t
    ),
    'by_day', (
      select coalesce(jsonb_object_agg(t.d, t.n), '{}'::jsonb) from (
        select to_char(created_at at time zone 'utc', 'YYYY-MM-DD') as d,
               count(distinct device_id) as n
          from events
         where created_at >= v_from
         group by 1 order by 1
      ) t
    ),
    'purchases_total', (select count(*) from events where event = 'purchase_done'),
    'promo_redeemed_total', (select count(*) from promo_redemptions)
  ) into v;
  return v;
end $$;
revoke all on function admin_stats(int) from public;
grant execute on function admin_stats(int) to authenticated;

-- ── Сводка по учебному прогрессу (облачные аккаунты) ──────────────────
create or replace function admin_overview()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  res jsonb;
begin
  if not is_admin() then raise exception 'forbidden'; end if;

  select jsonb_build_object(
    'generated_at', now(),
    'total_users', (select count(*) from auth.users),
    'users_7d',  (select count(*) from auth.users where created_at > now() - interval '7 days'),
    'users_30d', (select count(*) from auth.users where created_at > now() - interval '30 days'),
    'signups_by_day', (
      select coalesce(jsonb_agg(jsonb_build_object('d', d, 'n', n) order by d), '[]'::jsonb)
      from (
        select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') d, count(*) n
        from auth.users
        where created_at > now() - interval '30 days'
        group by 1
      ) s
    ),
    'profiles', (select count(*) from progress),
    'active_7d', (
      select count(*) from progress p
      where (
        select max(k::date)
        from jsonb_object_keys(coalesce(p.data -> 'history', '{}'::jsonb)) as t(k)
      ) > (now() - interval '7 days')::date
    ),
    'total_xp', (select coalesce(sum((data ->> 'xp')::int), 0) from progress),
    'total_words', (
      select coalesce(sum(cnt), 0) from (
        select (select count(*) from jsonb_object_keys(coalesce(data -> 'words', '{}'::jsonb))) cnt
        from progress
      ) z
    ),
    'total_lessons', (
      select coalesce(sum(cnt), 0) from (
        select (select count(*) from jsonb_object_keys(coalesce(data -> 'lessons', '{}'::jsonb))) cnt
        from progress
      ) z
    ),
    'level_dist', (
      select coalesce(jsonb_object_agg(lvl, n), '{}'::jsonb) from (
        select coalesce(data ->> 'level', '1') lvl, count(*) n
        from progress group by 1
      ) z
    )
  ) into res;
  return res;
end $$;
revoke all on function admin_overview() from public;
grant execute on function admin_overview() to authenticated;
