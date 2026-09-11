-- ---------------------------------------------------------------------------
-- Phase 0: Supabase-native foundation (RLS, profiles/auth linkage, business
-- id RPC). This closes an open security gap (no RLS existed on any table,
-- meaning the anon key could read users.password_hash, PAN/Aadhaar numbers,
-- etc. via PostgREST) and prepares the schema for the client to talk to
-- Supabase directly (no Express API).
-- ---------------------------------------------------------------------------

-- ============================================================================
-- 1. profiles table — links auth.users to app-level role or metadata
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'candidate'
    CHECK (role IN ('admin', 'hr', 'recruiter', 'editor', 'candidate', 'client')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. is_staff() — true for admin/editor roles (mirrors old ADMIN_PORTAL_ROLES)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_staff() TO anon, authenticated;

CREATE POLICY "profiles_select_own_or_staff" ON public.profiles
  FOR SELECT
  USING (id = auth.uid() OR public.is_staff());

-- No public UPDATE/INSERT/DELETE policy on profiles: role changes are an
-- admin-only, dashboard/service-role operation, not a client-writable field.

-- ============================================================================
-- 3. Auto-create a profile row whenever a new auth user signs up
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'candidate')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 4. next_business_id RPC — atomic QDLJB-0001 style ids (replaces
--    server/src/utils/businessId.ts; runs as SECURITY DEFINER so it can
--    write id_counters even though clients have no direct table grants)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.next_business_id(kind TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_value INT;
  v_prefix TEXT;
BEGIN
  IF NOT public.is_staff() THEN
    RAISE EXCEPTION 'insufficient privileges';
  END IF;

  IF kind NOT IN ('job', 'internship', 'project', 'portfolio', 'blog') THEN
    RAISE EXCEPTION 'invalid kind: %', kind;
  END IF;

  INSERT INTO public.id_counters (name, last_value)
  VALUES (kind, 0)
  ON CONFLICT (name) DO NOTHING;

  UPDATE public.id_counters
  SET last_value = last_value + 1
  WHERE name = kind
  RETURNING last_value INTO v_value;

  v_prefix := CASE kind
    WHEN 'job' THEN 'QDLJB'
    WHEN 'internship' THEN 'QDLIN'
    WHEN 'project' THEN 'QDLPJ'
    WHEN 'portfolio' THEN 'QDLPF'
    WHEN 'blog' THEN 'QDLBL'
  END;

  RETURN v_prefix || '-' || lpad(v_value::TEXT, 4, '0');
END;
$$;

GRANT EXECUTE ON FUNCTION public.next_business_id(TEXT) TO authenticated;

-- ============================================================================
-- 5. Lock down legacy / internal tables (users, id_counters): RLS enabled,
--    zero policies -> completely inaccessible via the anon/authenticated
--    PostgREST roles. Only the service_role key (server-side/admin tooling)
--    can still read/write them directly.
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_counters ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. CMS content tables: public can read published rows, staff can read/
--    write everything.
-- ============================================================================

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'jobs', 'internships', 'projects', 'portfolio_items',
    'blog_posts', 'service_categories', 'services'
  ]
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

    EXECUTE format(
      'DROP POLICY IF EXISTS %I ON public.%I',
      t || '_select_published_or_staff', t
    );
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR SELECT USING (published = TRUE OR public.is_staff())',
      t || '_select_published_or_staff', t
    );

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_write_staff', t);
    EXECUTE format(
      'CREATE POLICY %I ON public.%I FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff())',
      t || '_write_staff', t
    );
  END LOOP;
END $$;

-- about_content: single row, no "published" column — publicly readable,
-- staff-only writable.
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS about_content_select_public ON public.about_content;
CREATE POLICY about_content_select_public ON public.about_content
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS about_content_write_staff ON public.about_content;
CREATE POLICY about_content_write_staff ON public.about_content
  FOR ALL USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ============================================================================
-- 7. Applications: authenticated users can create/read their own; staff can
--    read/update all (status changes).
-- ============================================================================

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS job_applications_insert_own ON public.job_applications;
CREATE POLICY job_applications_insert_own ON public.job_applications
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS job_applications_select_own_or_staff ON public.job_applications;
CREATE POLICY job_applications_select_own_or_staff ON public.job_applications
  FOR SELECT USING (user_id = auth.uid() OR public.is_staff());

DROP POLICY IF EXISTS job_applications_update_staff ON public.job_applications;
CREATE POLICY job_applications_update_staff ON public.job_applications
  FOR UPDATE USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS internship_applications_insert_own ON public.internship_applications;
CREATE POLICY internship_applications_insert_own ON public.internship_applications
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS internship_applications_select_own_or_staff ON public.internship_applications;
CREATE POLICY internship_applications_select_own_or_staff ON public.internship_applications
  FOR SELECT USING (user_id = auth.uid() OR public.is_staff());

DROP POLICY IF EXISTS internship_applications_update_staff ON public.internship_applications;
CREATE POLICY internship_applications_update_staff ON public.internship_applications
  FOR UPDATE USING (public.is_staff()) WITH CHECK (public.is_staff());

-- ============================================================================
-- 8. Inquiries (contact/quote/demo leads): anyone can submit; only staff
--    can read them back.
-- ============================================================================

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS inquiries_insert_public ON public.inquiries;
CREATE POLICY inquiries_insert_public ON public.inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

DROP POLICY IF EXISTS inquiries_select_staff ON public.inquiries;
CREATE POLICY inquiries_select_staff ON public.inquiries
  FOR SELECT USING (public.is_staff());
