-- Hevre CRM: Supabase schema + RLS setup
-- Run this in the Supabase SQL Editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  address text,
  project_type text,
  estimated_cost numeric,
  offered_price numeric,
  has_mortgage boolean not null default false,
  mortgage_balance numeric,
  home_value numeric,
  description text,
  tasks jsonb not null default '[]'::jsonb,
  archive_status text not null default 'active'
    check (archive_status in ('active', 'completed', 'cancelled')),
  lead_status text not null default 'follow_up'
    check (lead_status in ('follow_up', 'sold')),
  sort_order integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_user_id_idx on public.clients (user_id);
create index if not exists clients_archive_status_idx on public.clients (archive_status);
create index if not exists clients_updated_at_idx on public.clients (updated_at desc);
create index if not exists clients_sort_order_idx on public.clients (sort_order);

-- Auto-update `updated_at` on every row update, so "most recently touched"
-- sorting on the Active tab works without the app having to set it manually.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
  before update on public.clients
  for each row
  execute function public.set_updated_at();

-- Row-Level Security: each salesperson only sees/edits their own clients.
alter table public.clients enable row level security;

drop policy if exists "clients_select_own" on public.clients;
create policy "clients_select_own"
  on public.clients for select
  using (auth.uid() = user_id);

drop policy if exists "clients_insert_own" on public.clients;
create policy "clients_insert_own"
  on public.clients for insert
  with check (auth.uid() = user_id);

drop policy if exists "clients_update_own" on public.clients;
create policy "clients_update_own"
  on public.clients for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "clients_delete_own" on public.clients;
create policy "clients_delete_own"
  on public.clients for delete
  using (auth.uid() = user_id);
