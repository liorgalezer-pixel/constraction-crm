-- Replaces the separate mortgage status / monthly payment fields with a
-- single mortgage balance field. Run this in the Supabase SQL Editor.

alter table public.clients
  add column if not exists mortgage_balance numeric;

alter table public.clients
  drop column if exists mortgage_status;

alter table public.clients
  drop column if exists mortgage_monthly_payment;
