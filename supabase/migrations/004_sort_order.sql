-- Lets clients be manually reordered (long-press drag) within a list.
-- Run this in the Supabase SQL Editor.

alter table public.clients
  add column if not exists sort_order integer;

create index if not exists clients_sort_order_idx on public.clients (sort_order);
