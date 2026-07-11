-- Mend — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

-- ============ PROFILES ============
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  physio_name text,
  clinic_name text,
  accepted_terms_at timestamptz,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ ROUTINES & EXERCISES ============
create table if not exists public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  source text default 'manual',          -- manual | import
  prescriber_name text,                  -- e.g. "Dr. Lena Park"
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  routine_id uuid not null references public.routines(id) on delete cascade,
  position int not null,                 -- order within routine
  phase text default 'activate',         -- warmup | activate | stabilize | cooldown
  name text not null,
  area text,                             -- e.g. "Glutes"
  type text not null default 'reps',     -- reps | hold
  reps int default 0,
  hold_seconds int default 0,
  sets int not null default 1,
  rest_seconds int not null default 30,
  cue text,
  video_url text                          -- future: owned video assets
);

-- ============ DAILY CHECK-INS ============
create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null default current_date,
  pain_level int not null check (pain_level between 0 and 10),
  tension_areas text[] default '{}',
  stiffness text default 'none',         -- none | mild | moderate | high
  created_at timestamptz default now(),
  unique (user_id, checkin_date)
);

-- ============ COMPLETED SESSIONS ============
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  routine_id uuid references public.routines(id) on delete set null,
  started_at timestamptz default now(),
  completed_at timestamptz,
  exercises_completed int default 0,
  total_exercises int default 0,
  notes text
);

-- ============ ROW LEVEL SECURITY ============
alter table public.profiles enable row level security;
alter table public.routines enable row level security;
alter table public.exercises enable row level security;
alter table public.checkins enable row level security;
alter table public.sessions enable row level security;

-- Profiles: users manage only their own row
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

-- Routines
create policy "own routines" on public.routines for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Exercises: via parent routine ownership
create policy "own exercises" on public.exercises for all
  using (exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.routines r where r.id = routine_id and r.user_id = auth.uid()));

-- Check-ins
create policy "own checkins" on public.checkins for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Sessions
create policy "own sessions" on public.sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
