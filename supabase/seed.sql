-- ============================================================
-- LeaseU — Seed Data
-- Run AFTER migration.sql in Supabase SQL Editor
-- ============================================================
-- NOTE: To create auth users, use the Supabase Dashboard
--       (Authentication → Users → Add User) for:
--
--   1) admin@leaseu.app    / leaseu-admin   (then UPDATE role below)
--   2) student@fsu.edu     / host123        (auto host via trigger)
--   3) viewer@gmail.com    / viewer123      (auto viewer via trigger)
--
-- After those users exist in auth.users, run this seed SQL
-- to fix the admin role and insert listings + settings.
-- ============================================================

-- Promote admin
update public.profiles
set role = 'admin', edu_verified = true, email_verified = true
where email = 'admin@leaseu.app';

-- Ensure host is correct
update public.profiles
set role = 'host', edu_verified = true, email_verified = true
where email = 'student@fsu.edu';

-- Insert demo listings (uses the host's profile id)
do $$
declare
  _host_id uuid;
begin
  select id into _host_id from public.profiles where email = 'student@fsu.edu' limit 1;

  if _host_id is null then
    raise notice 'Host user student@fsu.edu not found — skipping listings seed.';
    return;
  end if;

  if (select count(*) from public.listings) > 0 then
    raise notice 'Listings already exist — skipping seed.';
    return;
  end if;

  insert into public.listings (title, price_display, price_cents, beds, baths, listing_type, description, cover_image_url, status, urgent, featured, host_id) values
    ('2BR CollegeTown - Available May',       '$1,200/mo', 120000, 2, 2, 'lease_takeover', 'Spacious 2BR unit. Walking distance to campus. Contact for details.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'approved', true,  true,  _host_id),
    ('1BR Sublet Summer 2025',                '$950/mo',    95000, 1, 1, 'sublet',         'Spacious 1BR unit. Walking distance to campus. Contact for details.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'approved', true,  false, _host_id),
    ('Room in 4BR House - West Tennessee',    '$650/mo',    65000, 1, 1, 'room',           'Spacious 1BR unit. Walking distance to campus. Contact for details.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'approved', false, false, _host_id),
    ('Studio Near Stadium',                   '$1,100/mo', 110000, 1, 1, 'lease_takeover', 'Spacious 1BR unit. Walking distance to campus. Contact for details.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'approved', false, false, _host_id),
    ('3BR The Renegade - Furnished',          '$1,800/mo', 180000, 3, 2, 'lease_takeover', 'Spacious 3BR unit. Walking distance to campus. Contact for details.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'approved', false, true,  _host_id),
    ('Private Room - Female Preferred',       '$700/mo',    70000, 1, 1, 'room',           'Spacious 1BR unit. Walking distance to campus. Contact for details.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'approved', true,  false, _host_id),
    ('2BR Sublet Jan-Aug 2025',               '$1,150/mo', 115000, 2, 2, 'sublet',         'Spacious 2BR unit. Walking distance to campus. Contact for details.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'approved', false, true,  _host_id),
    ('1BR Looking for Roommate',              '$550/mo',    55000, 1, 1, 'room',           'Spacious 1BR unit. Walking distance to campus. Contact for details.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'approved', false, false, _host_id),
    ('4BR House - All Rooms Available',       '$2,200/mo', 220000, 4, 3, 'lease_takeover', 'Spacious 4BR unit. Walking distance to campus. Contact for details.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'approved', false, true,  _host_id),
    ('Cozy 1BR Near Library',                 '$980/mo',    98000, 1, 1, 'lease_takeover', 'Spacious 1BR unit. Walking distance to campus. Contact for details.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'approved', false, false, _host_id),
    ('Room for Rent - Utilities Included',    '$720/mo',    72000, 1, 1, 'room',           'Spacious 1BR unit. Walking distance to campus. Contact for details.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'approved', false, false, _host_id),
    ('2BR Lease Takeover - Immediate',        '$1,250/mo', 125000, 2, 2, 'lease_takeover', 'Spacious 2BR unit. Walking distance to campus. Contact for details.', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200', 'approved', true,  true,  _host_id);
end $$;

-- Default site images
insert into public.site_settings (key, value) values
  ('heroImage',             '/images/hero-campus.jpg'),
  ('builtForStudentsImage', '/images/housing-exterior.jpg'),
  ('listingFallbackImage',  '/images/listing-fallback.jpg')
on conflict (key) do nothing;
