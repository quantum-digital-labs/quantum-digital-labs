-- ---------------------------------------------------------------------------
-- Storage buckets for direct client uploads (replaces multer + local disk,
-- which was ephemeral on Vercel anyway).
--   media   -> public bucket: project/portfolio screenshots, cover images
--   resumes -> private bucket: job/internship application resumes
-- ---------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', FALSE)
ON CONFLICT (id) DO NOTHING;

-- media: anyone can read, only staff can write/update/delete
DROP POLICY IF EXISTS media_public_read ON storage.objects;
CREATE POLICY media_public_read ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS media_staff_insert ON storage.objects;
CREATE POLICY media_staff_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.is_staff());

DROP POLICY IF EXISTS media_staff_update ON storage.objects;
CREATE POLICY media_staff_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.is_staff());

DROP POLICY IF EXISTS media_staff_delete ON storage.objects;
CREATE POLICY media_staff_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.is_staff());

-- resumes: an authenticated user can upload/read only under their own
-- "<uid>/..." path prefix; staff can read every resume (for the admin CMS).
DROP POLICY IF EXISTS resumes_owner_insert ON storage.objects;
CREATE POLICY resumes_owner_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'resumes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS resumes_owner_or_staff_read ON storage.objects;
CREATE POLICY resumes_owner_or_staff_read ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'resumes'
    AND ((storage.foldername(name))[1] = auth.uid()::text OR public.is_staff())
  );
