-- Adds a Sold / Follow Up status per client, editable from the client card.
-- Run this in the Supabase SQL Editor.

alter table public.clients
  add column if not exists lead_status text not null default 'follow_up'
    check (lead_status in ('follow_up', 'sold'));
