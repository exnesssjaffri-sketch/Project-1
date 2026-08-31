-- ═══════════════════════════════════════════════════════════════
-- HABIT TRACKER — Supabase schema
-- ═══════════════════════════════════════════════════════════════
-- Kaise chalayein:
--   1. Supabase Dashboard kholo → your project → SQL Editor
--   2. Download yeh poori file ko editor mein paste karo
--   3. "Run" dabao. Bas!

-- ── Habits table ────────────────────────────────────────────────
create table if not exists public.habits (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,
  name       text not null,
  status     text not null default 'pending'
             check (status in ('pending', 'done')),
  created_at timestamptz not null default now()
);

-- ── Row Level Security (RLS) ────────────────────────────────────
-- Har user SIRF apni habits dekh/change kar sakta hai.
alter table public.habits enable row level security;

create policy "users select own habits"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "users insert own habits"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "users update own habits"
  on public.habits for update
  using (auth.uid() = user_id);

create policy "users delete own habits"
  on public.habits for delete
  using (auth.uid() = user_id);

-- ── Optional: index for faster queries ──────────────────────────
create index if not exists habits_user_id_idx on public.habits (user_id);