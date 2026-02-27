-- ============================================================
-- LeaseU — Corrected Supabase Migration
-- Tables, Triggers, RLS Policies
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================
-- SAFE: uses DROP POLICY IF EXISTS before every CREATE POLICY
-- SAFE: uses CREATE OR REPLACE for functions
-- SAFE: uses CREATE TABLE IF NOT EXISTS
-- ============================================================

-- FIX #5: Ensure gen_random_uuid() works on all Supabase plans
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- -------------------- PROFILES --------------------
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  role           text not null default 'viewer' check (role in ('viewer','host','admin')),
  email          text not null,
  email_verified boolean not null default false,
  edu_verified   boolean not null default false,
  created_at     timestamptz not null default now()
);

-- FIX #6: Unique constraint on email prevents duplicate profile rows
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_email_unique'
  ) then
    alter table public.profiles add constraint profiles_email_unique unique (email);
  end if;
end $$;

alter table public.profiles enable row level security;

-- -------------------- LISTINGS --------------------
create table if not exists public.listings (
  id                    uuid primary key default gen_random_uuid(),
  university_slug       text not null default 'fsu',
  title                 text not null,
  location_city         text not null default 'Tallahassee',
  location_state        text not null default 'FL',
  price_display         text not null,
  price_cents           integer not null,
  cover_image_url       text,
  beds                  integer not null default 0,
  baths                 real not null default 1,
  listing_type          text not null check (listing_type in ('sublet','lease_takeover','room')),
  description           text not null default '',
  available_date        date,
  verified_student_only boolean not null default true,
  status                text not null default 'pending' check (status in ('draft','pending','approved','rejected','removed')),
  urgent                boolean not null default false,
  featured              boolean not null default false,
  host_id               uuid not null references public.profiles(id) on delete cascade,
  created_at            timestamptz not null default now()
);

alter table public.listings enable row level security;

-- -------------------- MESSAGES --------------------
create table if not exists public.messages (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid not null references public.listings(id) on delete cascade,
  from_user_id  uuid not null references public.profiles(id) on delete cascade,
  to_user_id    uuid not null references public.profiles(id) on delete cascade,
  body          text not null,
  created_at    timestamptz not null default now()
);

alter table public.messages enable row level security;

-- -------------------- REPORTS --------------------
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  reason      text,
  details     text,
  created_at  timestamptz not null default now()
);

alter table public.reports enable row level security;

-- -------------------- SITE SETTINGS --------------------
create table if not exists public.site_settings (
  id    uuid primary key default gen_random_uuid(),
  key   text not null unique,
  value text not null
);

alter table public.site_settings enable row level security;

-- ============================================================
-- HELPER: SECURITY DEFINER function to check admin status.
-- This runs as the function owner (bypasses RLS on profiles),
-- preventing infinite recursion when admin policies on OTHER
-- tables query the profiles table (which itself has RLS).
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
$$;

-- Same pattern: check if the caller is edu-verified FSU
create or replace function public.is_fsu_verified()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and edu_verified = true
      and email ilike '%@fsu.edu'
  )
$$;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Trigger A: Auto-create profile on signup (INSERT)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  _email text;
  _is_fsu boolean;
  _is_confirmed boolean;
begin
  _email := new.email;
  _is_fsu := (_email ilike '%@fsu.edu');
  _is_confirmed := (new.email_confirmed_at is not null);

  insert into public.profiles (id, email, role, email_verified, edu_verified)
  values (
    new.id,
    _email,
    case when _is_fsu then 'host' else 'viewer' end,
    _is_confirmed,
    _is_fsu and _is_confirmed
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- FIX #3: Trigger B — Update profiles AFTER email confirmation
create or replace function public.handle_email_confirmation()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.profiles
  set
    email_verified = true,
    edu_verified   = (new.email ilike '%@fsu.edu')
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_email_confirmed on auth.users;
create trigger on_auth_user_email_confirmed
  after update of email_confirmed_at on auth.users
  for each row
  when (new.email_confirmed_at is not null and old.email_confirmed_at is null)
  execute function public.handle_email_confirmation();

-- ============================================================
-- RLS POLICIES — Drop all existing, then recreate
-- ============================================================

-- ==================== PROFILES ====================
drop policy if exists "Users can read own profile"        on public.profiles;
drop policy if exists "Users can update own profile"      on public.profiles;
drop policy if exists "Admin full access to profiles"     on public.profiles;

-- Users can read their own profile row
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- FIX #1: NO user self-update policy.
-- All profile fields (role, email, email_verified, edu_verified) are
-- security-critical. Only triggers and admins may write to profiles.

-- Admin can do everything on profiles (promote, ban, etc.)
-- Uses is_admin() SECURITY DEFINER function to avoid infinite recursion
create policy "Admin full access to profiles"
  on public.profiles for all
  using (public.is_admin());

-- ==================== LISTINGS ====================
drop policy if exists "Anyone can read approved listings" on public.listings;
drop policy if exists "Hosts can read own listings"       on public.listings;
drop policy if exists "Hosts can insert listings"         on public.listings;
drop policy if exists "Hosts can update own listings"     on public.listings;
drop policy if exists "Admin full access to listings"     on public.listings;

-- Public browsing: anyone (even anon) sees approved listings
create policy "Anyone can read approved listings"
  on public.listings for select
  using (status = 'approved');

-- Hosts can always see their own listings (pending, rejected, etc.)
create policy "Hosts can read own listings"
  on public.listings for select
  using (auth.uid() = host_id);

-- Verified FSU hosts/admins can create listings.
-- Uses is_fsu_verified() to avoid recursion into profiles RLS.
create policy "Hosts can insert listings"
  on public.listings for insert
  with check (
    auth.uid() = host_id
    and public.is_fsu_verified()
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
        and role in ('host', 'admin')
    )
  );

-- FIX #2: Hosts can update their own listing CONTENT, but CANNOT
-- change status, urgent, featured, or host_id.
create policy "Hosts can update own listings"
  on public.listings for update
  using (auth.uid() = host_id)
  with check (
    auth.uid() = host_id
    and status   = (select l.status   from public.listings l where l.id = listings.id)
    and urgent   = (select l.urgent   from public.listings l where l.id = listings.id)
    and featured = (select l.featured from public.listings l where l.id = listings.id)
    and host_id  = (select l.host_id  from public.listings l where l.id = listings.id)
  );

-- Admin bypasses all restrictions on listings
create policy "Admin full access to listings"
  on public.listings for all
  using (public.is_admin());

-- ==================== MESSAGES ====================
drop policy if exists "Participants can read messages"    on public.messages;
drop policy if exists "Verified users can send messages"  on public.messages;
drop policy if exists "Admin full access to messages"     on public.messages;

-- Only sender and recipient can read the conversation
create policy "Participants can read messages"
  on public.messages for select
  using (auth.uid() = from_user_id or auth.uid() = to_user_id);

-- FIX #4: Messages can only be sent TO the listing host.
-- Uses is_fsu_verified() to avoid recursion.
create policy "Verified users can send messages"
  on public.messages for insert
  with check (
    auth.uid() = from_user_id
    and public.is_fsu_verified()
    and exists (
      select 1 from public.listings
      where id = listing_id
        and status = 'approved'
        and host_id = to_user_id
    )
  );

-- Admin full access to messages (moderation, support)
create policy "Admin full access to messages"
  on public.messages for all
  using (public.is_admin());

-- ==================== REPORTS ====================
drop policy if exists "Authenticated users can insert reports" on public.reports;
drop policy if exists "Admin can read all reports"             on public.reports;

-- Any authenticated user can file a report on a listing
create policy "Authenticated users can insert reports"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

-- Only admin can view reports
create policy "Admin can read all reports"
  on public.reports for select
  using (public.is_admin());

-- ==================== SITE SETTINGS ====================
drop policy if exists "Anyone can read site settings"  on public.site_settings;
drop policy if exists "Admin can manage site settings" on public.site_settings;

-- Public read (hero images, feature flags, etc.)
create policy "Anyone can read site settings"
  on public.site_settings for select
  using (true);

-- Only admin can insert/update/delete site settings
create policy "Admin can manage site settings"
  on public.site_settings for all
  using (public.is_admin());
