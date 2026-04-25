create table if not exists public.planner_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  planner_state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.planner_snapshots enable row level security;

drop policy if exists "planner_select_own" on public.planner_snapshots;
create policy "planner_select_own"
on public.planner_snapshots
for select
using (auth.uid() = user_id);

drop policy if exists "planner_insert_own" on public.planner_snapshots;
create policy "planner_insert_own"
on public.planner_snapshots
for insert
with check (auth.uid() = user_id);

drop policy if exists "planner_update_own" on public.planner_snapshots;
create policy "planner_update_own"
on public.planner_snapshots
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "planner_delete_own" on public.planner_snapshots;
create policy "planner_delete_own"
on public.planner_snapshots
for delete
using (auth.uid() = user_id);
