-- Fixes a bug from the Phase 0 RLS migration: job_applications.user_id,
-- internship_applications.user_id, and inquiries.user_id were left pointing
-- at the legacy public.users table (the old Express app's user store).
-- Since the app now uses Supabase Auth exclusively, new users only ever
-- exist in auth.users (mirrored into public.profiles) — public.users no
-- longer receives any new rows. As a result, every insert with a real
-- user_id was failing with:
--   insert or update on table "job_applications" violates foreign key
--   constraint "job_applications_user_id_fkey"
--
-- This repoints all three foreign keys at auth.users(id) instead.

ALTER TABLE public.job_applications
  DROP CONSTRAINT IF EXISTS job_applications_user_id_fkey,
  ADD CONSTRAINT job_applications_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE SET NULL;

ALTER TABLE public.internship_applications
  DROP CONSTRAINT IF EXISTS internship_applications_user_id_fkey,
  ADD CONSTRAINT internship_applications_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE SET NULL;

ALTER TABLE public.inquiries
  DROP CONSTRAINT IF EXISTS inquiries_user_id_fkey,
  ADD CONSTRAINT inquiries_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE SET NULL;
