-- ═══════════════════════════════════════════════════════════════════════
-- «Добродошли» · вечный безлимит: разрешить промокодам и начислениям
-- срок до 36500 дней (100 лет = «навсегда»; приложение показывает «♾»).
-- Выполнить ОДИН РАЗ: Supabase → SQL Editor → New query → вставить → Run.
-- Повторный запуск безопасен.
-- ═══════════════════════════════════════════════════════════════════════

alter table promo_codes drop constraint if exists promo_codes_days_check;
alter table promo_codes add constraint promo_codes_days_check
  check (days between 1 and 36500);

alter table premium_grants drop constraint if exists premium_grants_days_check;
alter table premium_grants add constraint premium_grants_days_check
  check (days between 1 and 36500);
