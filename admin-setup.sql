-- ════════════════════════════════════════════════════════════════════════
-- Добродошли · личный кабинет: серверная функция статистики
-- ВСТАВЬ ЦЕЛИКОМ в Supabase → SQL Editor → Run. Можно запускать повторно.
--
-- Что делает: считает агрегаты (число юзеров, регистрации по дням,
-- активность, XP, слова, уроки, распределение по уровням) и отдаёт их
-- ТОЛЬКО если вошёл админ из списка ADMIN_EMAILS ниже. Персональные
-- данные наружу не отдаются — только цифры.
-- ════════════════════════════════════════════════════════════════════════

create or replace function public.admin_overview()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  -- ⬇️ ТВОИ почты-админы. Оставь те, которыми реально входишь в кабинет.
  admin_emails text[] := array['sunny.alla2001@gmail.com', 'daanameporia@gmail.com'];
  email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  res jsonb;
begin
  if not (email = any (admin_emails)) then
    raise exception 'Not authorized';
  end if;

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
      select coalesce(jsonb_object_agg(lvl, n), '{}'::jsonb)
      from (select coalesce(data ->> 'level', '1') lvl, count(*) n from progress group by 1) s
    )
  ) into res;

  return res;
end;
$$;

revoke all on function public.admin_overview() from public, anon;
grant execute on function public.admin_overview() to authenticated;
