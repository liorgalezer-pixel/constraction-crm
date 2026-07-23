-- Manually-entered home value (looked up on Zillow), shown above the
-- mortgage box. Run this in the Supabase SQL Editor.

alter table public.clients
  add column if not exists home_value numeric;
