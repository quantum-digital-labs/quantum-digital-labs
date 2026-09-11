-- Quantum Digital Labs — PostgreSQL schema
-- Matches frontend auth, applications, and inquiries APIs.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM (
    'admin',
    'hr',
    'recruiter',
    'editor',
    'candidate',
    'client'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE job_application_status AS ENUM (
    'received',
    'reviewing',
    'shortlisted',
    'rejected',
    'hired'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE internship_application_status AS ENUM (
    'received',
    'reviewing',
    'shortlisted',
    'rejected',
    'selected'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE inquiry_type AS ENUM ('contact', 'quote', 'demo');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  role user_role NOT NULL DEFAULT 'candidate',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_token TEXT,
  verification_code TEXT,
  verification_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  job_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  education TEXT NOT NULL,
  experience TEXT NOT NULL,
  skills TEXT NOT NULL,
  linkedin TEXT,
  portfolio TEXT,
  cover_letter TEXT NOT NULL,
  pan_number TEXT NOT NULL,
  aadhaar_number TEXT NOT NULL,
  accept_terms BOOLEAN NOT NULL DEFAULT FALSE,
  resume_file_name TEXT,
  resume_path TEXT,
  status job_application_status NOT NULL DEFAULT 'received',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS internship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  internship_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  course TEXT NOT NULL,
  year TEXT NOT NULL,
  skills TEXT NOT NULL,
  message TEXT NOT NULL,
  pan_number TEXT NOT NULL,
  aadhaar_number TEXT NOT NULL,
  accept_terms BOOLEAN NOT NULL DEFAULT FALSE,
  resume_file_name TEXT,
  resume_path TEXT,
  status internship_application_status NOT NULL DEFAULT 'received',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT NOT NULL UNIQUE,
  type inquiry_type NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  service TEXT,
  message TEXT,
  budget TEXT,
  requirements TEXT,
  timeline TEXT,
  project TEXT,
  preferred_date TEXT,
  user_id UUID REFERENCES users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users (verification_token);

CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications (user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications (email);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications (status);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications (job_id);

CREATE INDEX IF NOT EXISTS idx_internship_applications_user_id ON internship_applications (user_id);
CREATE INDEX IF NOT EXISTS idx_internship_applications_email ON internship_applications (email);
CREATE INDEX IF NOT EXISTS idx_internship_applications_status ON internship_applications (status);
CREATE INDEX IF NOT EXISTS idx_internship_applications_internship_id ON internship_applications (internship_id);

CREATE INDEX IF NOT EXISTS idx_inquiries_type ON inquiries (type);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries (email);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON inquiries (user_id);

-- One application per user per job / internship (when logged in)
CREATE UNIQUE INDEX IF NOT EXISTS uq_job_applications_user_job
  ON job_applications (user_id, job_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_internship_applications_user_internship
  ON internship_applications (user_id, internship_id)
  WHERE user_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- CMS content tables (Admin CMS)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT '',
  experience TEXT NOT NULL DEFAULT '',
  job_type TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  openings INT,
  salary TEXT,
  application_deadline DATE,
  work_mode TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS internships (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  role TEXT NOT NULL DEFAULT '',
  domain TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  mode TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  eligibility TEXT[] NOT NULL DEFAULT '{}',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  skills TEXT[] NOT NULL DEFAULT '{}',
  projects TEXT[] NOT NULL DEFAULT '{}',
  responsibilities TEXT[] NOT NULL DEFAULT '{}',
  certificate TEXT NOT NULL DEFAULT '',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  learning_outcomes TEXT[] NOT NULL DEFAULT '{}',
  openings INT,
  stipend TEXT,
  start_date DATE,
  end_date DATE,
  work_mode TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  category TEXT NOT NULL DEFAULT '',
  client_type TEXT NOT NULL DEFAULT '',
  timeline TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT '',
  overview TEXT NOT NULL DEFAULT '',
  problem TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  results TEXT[] NOT NULL DEFAULT '{}',
  screenshots TEXT[] NOT NULL DEFAULT '{}',
  related_ids TEXT[] NOT NULL DEFAULT '{}',
  image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  category TEXT NOT NULL DEFAULT '',
  industry TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  timeline TEXT NOT NULL DEFAULT '',
  overview TEXT NOT NULL DEFAULT '',
  problem TEXT NOT NULL DEFAULT '',
  solution TEXT NOT NULL DEFAULT '',
  challenge TEXT NOT NULL DEFAULT '',
  strategy TEXT NOT NULL DEFAULT '',
  development TEXT NOT NULL DEFAULT '',
  technology_narrative TEXT NOT NULL DEFAULT '',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  results TEXT[] NOT NULL DEFAULT '{}',
  case_results TEXT[] NOT NULL DEFAULT '{}',
  metrics TEXT[] NOT NULL DEFAULT '{}',
  gallery_labels TEXT[] NOT NULL DEFAULT '{}',
  related_ids TEXT[] NOT NULL DEFAULT '{}',
  image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  slug TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  post_date TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  reading_time TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  content TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id TEXT NOT NULL REFERENCES service_categories (id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  short_description TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  process TEXT[] NOT NULL DEFAULT '{}',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  faq_questions TEXT[] NOT NULL DEFAULT '{}',
  faq_answers TEXT[] NOT NULL DEFAULT '{}',
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  image TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (category_id, slug)
);

CREATE TABLE IF NOT EXISTS about_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  vision TEXT NOT NULL DEFAULT '',
  mission TEXT NOT NULL DEFAULT '',
  why_choose TEXT[] NOT NULL DEFAULT '{}',
  journey_titles TEXT[] NOT NULL DEFAULT '{}',
  journey_texts TEXT[] NOT NULL DEFAULT '{}',
  value_titles TEXT[] NOT NULL DEFAULT '{}',
  value_descriptions TEXT[] NOT NULL DEFAULT '{}',
  value_accents TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_published ON jobs (published);
CREATE INDEX IF NOT EXISTS idx_internships_published ON internships (published);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects (published);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_published ON portfolio_items (published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts (published);
CREATE INDEX IF NOT EXISTS idx_services_category_id ON services (category_id);
CREATE INDEX IF NOT EXISTS idx_service_categories_sort ON service_categories (sort_order);

-- ---------------------------------------------------------------------------
-- UUID columns + sequential job/internship business IDs
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS id_counters (
  name TEXT PRIMARY KEY,
  last_value INT NOT NULL DEFAULT 0
);

INSERT INTO id_counters (name, last_value)
VALUES ('job', 0), ('internship', 0), ('project', 0), ('portfolio', 0), ('blog', 0)
ON CONFLICT (name) DO NOTHING;

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
ALTER TABLE internships ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
ALTER TABLE projects ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
ALTER TABLE service_categories ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS uuid UUID DEFAULT gen_random_uuid();

UPDATE jobs SET uuid = gen_random_uuid() WHERE uuid IS NULL;
UPDATE internships SET uuid = gen_random_uuid() WHERE uuid IS NULL;
UPDATE projects SET uuid = gen_random_uuid() WHERE uuid IS NULL;
UPDATE portfolio_items SET uuid = gen_random_uuid() WHERE uuid IS NULL;
UPDATE blog_posts SET uuid = gen_random_uuid() WHERE uuid IS NULL;
UPDATE service_categories SET uuid = gen_random_uuid() WHERE uuid IS NULL;
UPDATE about_content SET uuid = gen_random_uuid() WHERE uuid IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_jobs_uuid ON jobs (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uq_internships_uuid ON internships (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uq_projects_uuid ON projects (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uq_portfolio_items_uuid ON portfolio_items (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uq_blog_posts_uuid ON blog_posts (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uq_service_categories_uuid ON service_categories (uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uq_about_content_uuid ON about_content (uuid);

-- ---------------------------------------------------------------------------
-- Columnar fields for jobs / internships / services (migrate off data JSONB)
-- ---------------------------------------------------------------------------

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS summary TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS department TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS job_type TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS skills TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS responsibilities TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS requirements TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS benefits TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS openings INT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS salary TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_deadline DATE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS work_mode TEXT;
ALTER TABLE jobs ALTER COLUMN data SET DEFAULT '{}'::jsonb;

ALTER TABLE internships ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT '';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS domain TEXT NOT NULL DEFAULT '';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS duration TEXT NOT NULL DEFAULT '';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS mode TEXT NOT NULL DEFAULT '';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS summary TEXT NOT NULL DEFAULT '';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS eligibility TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS technologies TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS skills TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS projects TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS responsibilities TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS certificate TEXT NOT NULL DEFAULT '';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS benefits TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS learning_outcomes TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE internships ADD COLUMN IF NOT EXISTS openings INT;
ALTER TABLE internships ADD COLUMN IF NOT EXISTS stipend TEXT;
ALTER TABLE internships ADD COLUMN IF NOT EXISTS start_date DATE;
ALTER TABLE internships ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE internships ADD COLUMN IF NOT EXISTS work_mode TEXT;
ALTER TABLE internships ALTER COLUMN data SET DEFAULT '{}'::jsonb;

ALTER TABLE services ADD COLUMN IF NOT EXISTS short_description TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS benefits TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS features TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS technologies TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS process TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS deliverables TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS faqs JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS faq_questions TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS faq_answers TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE services ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '';
ALTER TABLE services ALTER COLUMN data SET DEFAULT '{}'::jsonb;

-- Backfill columns from legacy data JSONB (only when data still has fields)
UPDATE jobs
SET
  summary = COALESCE(NULLIF(summary, ''), data->>'summary', ''),
  location = COALESCE(NULLIF(location, ''), data->>'location', ''),
  department = COALESCE(NULLIF(department, ''), data->>'department', ''),
  experience = COALESCE(NULLIF(experience, ''), data->>'experience', ''),
  job_type = COALESCE(NULLIF(job_type, ''), data->>'jobType', ''),
  skills = CASE
    WHEN cardinality(skills) > 0 THEN skills
    WHEN jsonb_typeof(data->'skills') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'skills'))
    ELSE '{}'::text[]
  END,
  responsibilities = CASE
    WHEN cardinality(responsibilities) > 0 THEN responsibilities
    WHEN jsonb_typeof(data->'responsibilities') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'responsibilities'))
    ELSE '{}'::text[]
  END,
  requirements = CASE
    WHEN cardinality(requirements) > 0 THEN requirements
    WHEN jsonb_typeof(data->'requirements') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'requirements'))
    ELSE '{}'::text[]
  END,
  benefits = CASE
    WHEN cardinality(benefits) > 0 THEN benefits
    WHEN jsonb_typeof(data->'benefits') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'benefits'))
    ELSE '{}'::text[]
  END,
  openings = COALESCE(
    openings,
    NULLIF(data->>'openings', '')::INT
  ),
  salary = COALESCE(salary, NULLIF(data->>'salary', '')),
  application_deadline = COALESCE(
    application_deadline,
    CASE
      WHEN (data->>'applicationDeadline') ~ '^\d{4}-\d{2}-\d{2}'
        THEN (data->>'applicationDeadline')::DATE
      ELSE NULL
    END
  ),
  work_mode = COALESCE(work_mode, NULLIF(data->>'workMode', ''))
WHERE data IS NOT NULL AND data <> '{}'::jsonb;

UPDATE internships
SET
  role = COALESCE(NULLIF(role, ''), data->>'role', title, ''),
  domain = COALESCE(NULLIF(domain, ''), data->>'domain', ''),
  duration = COALESCE(NULLIF(duration, ''), data->>'duration', ''),
  mode = COALESCE(NULLIF(mode, ''), data->>'mode', ''),
  summary = COALESCE(NULLIF(summary, ''), data->>'summary', ''),
  eligibility = CASE
    WHEN cardinality(eligibility) > 0 THEN eligibility
    WHEN jsonb_typeof(data->'eligibility') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'eligibility'))
    ELSE '{}'::text[]
  END,
  technologies = CASE
    WHEN cardinality(technologies) > 0 THEN technologies
    WHEN jsonb_typeof(data->'technologies') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'technologies'))
    ELSE '{}'::text[]
  END,
  skills = CASE
    WHEN cardinality(skills) > 0 THEN skills
    WHEN jsonb_typeof(data->'skills') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'skills'))
    ELSE '{}'::text[]
  END,
  projects = CASE
    WHEN cardinality(projects) > 0 THEN projects
    WHEN jsonb_typeof(data->'projects') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'projects'))
    ELSE '{}'::text[]
  END,
  responsibilities = CASE
    WHEN cardinality(responsibilities) > 0 THEN responsibilities
    WHEN jsonb_typeof(data->'responsibilities') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'responsibilities'))
    ELSE '{}'::text[]
  END,
  certificate = COALESCE(NULLIF(certificate, ''), data->>'certificate', ''),
  benefits = CASE
    WHEN cardinality(benefits) > 0 THEN benefits
    WHEN jsonb_typeof(data->'benefits') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'benefits'))
    ELSE '{}'::text[]
  END,
  learning_outcomes = CASE
    WHEN cardinality(learning_outcomes) > 0 THEN learning_outcomes
    WHEN jsonb_typeof(data->'learningOutcomes') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'learningOutcomes'))
    ELSE '{}'::text[]
  END,
  openings = COALESCE(openings, NULLIF(data->>'openings', '')::INT),
  stipend = COALESCE(stipend, NULLIF(data->>'stipend', '')),
  start_date = COALESCE(
    start_date,
    CASE
      WHEN (data->>'startDate') ~ '^\d{4}-\d{2}-\d{2}'
        THEN (data->>'startDate')::DATE
      ELSE NULL
    END
  ),
  end_date = COALESCE(
    end_date,
    CASE
      WHEN (data->>'endDate') ~ '^\d{4}-\d{2}-\d{2}'
        THEN (data->>'endDate')::DATE
      WHEN (data->>'applicationDeadline') ~ '^\d{4}-\d{2}-\d{2}'
        THEN (data->>'applicationDeadline')::DATE
      ELSE NULL
    END
  ),
  work_mode = COALESCE(work_mode, NULLIF(data->>'workMode', ''))
WHERE data IS NOT NULL AND data <> '{}'::jsonb;

UPDATE services
SET
  short_description = COALESCE(
    NULLIF(short_description, ''),
    data->>'shortDescription',
    ''
  ),
  description = COALESCE(NULLIF(description, ''), data->>'description', ''),
  benefits = CASE
    WHEN cardinality(benefits) > 0 THEN benefits
    WHEN jsonb_typeof(data->'benefits') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'benefits'))
    ELSE '{}'::text[]
  END,
  features = CASE
    WHEN cardinality(features) > 0 THEN features
    WHEN jsonb_typeof(data->'features') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'features'))
    ELSE '{}'::text[]
  END,
  technologies = CASE
    WHEN cardinality(technologies) > 0 THEN technologies
    WHEN jsonb_typeof(data->'technologies') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'technologies'))
    ELSE '{}'::text[]
  END,
  process = CASE
    WHEN cardinality(process) > 0 THEN process
    WHEN jsonb_typeof(data->'process') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'process'))
    ELSE '{}'::text[]
  END,
  deliverables = CASE
    WHEN cardinality(deliverables) > 0 THEN deliverables
    WHEN jsonb_typeof(data->'deliverables') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'deliverables'))
    ELSE '{}'::text[]
  END,
  faqs = CASE
    WHEN faqs IS NOT NULL AND faqs <> '[]'::jsonb THEN faqs
    WHEN jsonb_typeof(data->'faqs') = 'array' THEN data->'faqs'
    ELSE '[]'::jsonb
  END,
  faq_questions = CASE
    WHEN cardinality(faq_questions) > 0 THEN faq_questions
    WHEN jsonb_typeof(COALESCE(NULLIF(faqs, '[]'::jsonb), data->'faqs')) = 'array'
      THEN ARRAY(
        SELECT COALESCE(elem->>'question', '')
        FROM jsonb_array_elements(COALESCE(NULLIF(faqs, '[]'::jsonb), data->'faqs')) AS elem
      )
    ELSE '{}'::text[]
  END,
  faq_answers = CASE
    WHEN cardinality(faq_answers) > 0 THEN faq_answers
    WHEN jsonb_typeof(COALESCE(NULLIF(faqs, '[]'::jsonb), data->'faqs')) = 'array'
      THEN ARRAY(
        SELECT COALESCE(elem->>'answer', '')
        FROM jsonb_array_elements(COALESCE(NULLIF(faqs, '[]'::jsonb), data->'faqs')) AS elem
      )
    ELSE '{}'::text[]
  END
WHERE data IS NOT NULL AND data <> '{}'::jsonb
   OR (faqs IS NOT NULL AND faqs <> '[]'::jsonb);

-- Clear legacy JSON blobs after columnar backfill
UPDATE jobs SET data = '{}'::jsonb WHERE data <> '{}'::jsonb;
UPDATE internships SET data = '{}'::jsonb WHERE data <> '{}'::jsonb;
UPDATE services SET data = '{}'::jsonb, faqs = '[]'::jsonb
WHERE data <> '{}'::jsonb OR faqs <> '[]'::jsonb;

-- ---------------------------------------------------------------------------
-- Columnar fields for projects / portfolio / blog / about
-- ---------------------------------------------------------------------------

ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client_type TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS timeline TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS overview TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS problem TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS technologies TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS features TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS deliverables TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS results TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS screenshots TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS related_ids TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ALTER COLUMN data SET DEFAULT '{}'::jsonb;

ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS industry TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS year TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS timeline TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS overview TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS problem TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS solution TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS challenge TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS strategy TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS development TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS technology_narrative TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS technologies TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS features TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS deliverables TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS results TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS case_results TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS metrics TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS gallery_labels TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS related_ids TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ALTER COLUMN data SET DEFAULT '{}'::jsonb;

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS slug TEXT NOT NULL DEFAULT '';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author TEXT NOT NULL DEFAULT '';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS post_date TEXT NOT NULL DEFAULT '';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS reading_time TEXT NOT NULL DEFAULT '';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt TEXT NOT NULL DEFAULT '';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE blog_posts ALTER COLUMN data SET DEFAULT '{}'::jsonb;

ALTER TABLE about_content ADD COLUMN IF NOT EXISTS vision TEXT NOT NULL DEFAULT '';
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS mission TEXT NOT NULL DEFAULT '';
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS why_choose TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS journey_titles TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS journey_texts TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS value_titles TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS value_descriptions TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS value_accents TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE about_content ALTER COLUMN data SET DEFAULT '{}'::jsonb;

UPDATE projects
SET
  category = COALESCE(NULLIF(category, ''), data->>'category', ''),
  client_type = COALESCE(NULLIF(client_type, ''), data->>'clientType', ''),
  timeline = COALESCE(NULLIF(timeline, ''), data->>'timeline', ''),
  status = COALESCE(NULLIF(status, ''), data->>'status', ''),
  overview = COALESCE(NULLIF(overview, ''), data->>'overview', ''),
  problem = COALESCE(NULLIF(problem, ''), data->>'problem', ''),
  solution = COALESCE(NULLIF(solution, ''), data->>'solution', ''),
  technologies = CASE
    WHEN cardinality(technologies) > 0 THEN technologies
    WHEN jsonb_typeof(data->'technologies') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'technologies'))
    ELSE '{}'::text[]
  END,
  features = CASE
    WHEN cardinality(features) > 0 THEN features
    WHEN jsonb_typeof(data->'features') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'features'))
    ELSE '{}'::text[]
  END,
  deliverables = CASE
    WHEN cardinality(deliverables) > 0 THEN deliverables
    WHEN jsonb_typeof(data->'deliverables') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'deliverables'))
    ELSE '{}'::text[]
  END,
  results = CASE
    WHEN cardinality(results) > 0 THEN results
    WHEN jsonb_typeof(data->'results') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'results'))
    ELSE '{}'::text[]
  END,
  screenshots = CASE
    WHEN cardinality(screenshots) > 0 THEN screenshots
    WHEN jsonb_typeof(data->'screenshots') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'screenshots'))
    ELSE '{}'::text[]
  END,
  related_ids = CASE
    WHEN cardinality(related_ids) > 0 THEN related_ids
    WHEN jsonb_typeof(data->'relatedIds') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'relatedIds'))
    ELSE '{}'::text[]
  END
WHERE data IS NOT NULL AND data <> '{}'::jsonb;

UPDATE portfolio_items
SET
  category = COALESCE(NULLIF(category, ''), data->>'category', ''),
  industry = COALESCE(NULLIF(industry, ''), data->>'industry', ''),
  year = COALESCE(NULLIF(year, ''), data->>'year', ''),
  role = COALESCE(NULLIF(role, ''), data->>'role', ''),
  timeline = COALESCE(NULLIF(timeline, ''), data->>'timeline', ''),
  overview = COALESCE(NULLIF(overview, ''), data->>'overview', ''),
  problem = COALESCE(NULLIF(problem, ''), data->>'problem', ''),
  solution = COALESCE(NULLIF(solution, ''), data->>'solution', ''),
  challenge = COALESCE(NULLIF(challenge, ''), data->>'challenge', ''),
  strategy = COALESCE(NULLIF(strategy, ''), data->>'strategy', ''),
  development = COALESCE(NULLIF(development, ''), data->>'development', ''),
  technology_narrative = COALESCE(
    NULLIF(technology_narrative, ''),
    data->>'technologyNarrative',
    ''
  ),
  technologies = CASE
    WHEN cardinality(technologies) > 0 THEN technologies
    WHEN jsonb_typeof(data->'technologies') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'technologies'))
    ELSE '{}'::text[]
  END,
  features = CASE
    WHEN cardinality(features) > 0 THEN features
    WHEN jsonb_typeof(data->'features') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'features'))
    ELSE '{}'::text[]
  END,
  deliverables = CASE
    WHEN cardinality(deliverables) > 0 THEN deliverables
    WHEN jsonb_typeof(data->'deliverables') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'deliverables'))
    ELSE '{}'::text[]
  END,
  results = CASE
    WHEN cardinality(results) > 0 THEN results
    WHEN jsonb_typeof(data->'results') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'results'))
    ELSE '{}'::text[]
  END,
  case_results = CASE
    WHEN cardinality(case_results) > 0 THEN case_results
    WHEN jsonb_typeof(data->'caseResults') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'caseResults'))
    ELSE '{}'::text[]
  END,
  metrics = CASE
    WHEN cardinality(metrics) > 0 THEN metrics
    WHEN jsonb_typeof(data->'metrics') = 'array'
      THEN ARRAY(
        SELECT CONCAT(COALESCE(elem->>'label', ''), ' | ', COALESCE(elem->>'value', ''))
        FROM jsonb_array_elements(data->'metrics') AS elem
      )
    ELSE '{}'::text[]
  END,
  gallery_labels = CASE
    WHEN cardinality(gallery_labels) > 0 THEN gallery_labels
    WHEN jsonb_typeof(data->'galleryLabels') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'galleryLabels'))
    ELSE '{}'::text[]
  END,
  related_ids = CASE
    WHEN cardinality(related_ids) > 0 THEN related_ids
    WHEN jsonb_typeof(data->'relatedIds') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'relatedIds'))
    ELSE '{}'::text[]
  END
WHERE data IS NOT NULL AND data <> '{}'::jsonb;

UPDATE blog_posts
SET
  slug = COALESCE(NULLIF(slug, ''), data->>'slug', id, ''),
  author = COALESCE(NULLIF(author, ''), data->>'author', ''),
  post_date = COALESCE(NULLIF(post_date, ''), data->>'date', ''),
  category = COALESCE(NULLIF(category, ''), data->>'category', ''),
  reading_time = COALESCE(NULLIF(reading_time, ''), data->>'readingTime', ''),
  excerpt = COALESCE(NULLIF(excerpt, ''), data->>'excerpt', ''),
  tags = CASE
    WHEN cardinality(tags) > 0 THEN tags
    WHEN jsonb_typeof(data->'tags') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'tags'))
    ELSE '{}'::text[]
  END,
  content = CASE
    WHEN cardinality(content) > 0 THEN content
    WHEN jsonb_typeof(data->'content') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'content'))
    ELSE '{}'::text[]
  END,
  featured = CASE
    WHEN featured = TRUE THEN TRUE
    WHEN (data->>'featured') = 'true' THEN TRUE
    ELSE FALSE
  END
WHERE data IS NOT NULL AND data <> '{}'::jsonb;

UPDATE about_content
SET
  vision = COALESCE(NULLIF(vision, ''), data->>'vision', ''),
  mission = COALESCE(NULLIF(mission, ''), data->>'mission', ''),
  why_choose = CASE
    WHEN cardinality(why_choose) > 0 THEN why_choose
    WHEN jsonb_typeof(data->'whyChoose') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(data->'whyChoose'))
    ELSE '{}'::text[]
  END,
  journey_titles = CASE
    WHEN cardinality(journey_titles) > 0 THEN journey_titles
    WHEN jsonb_typeof(data->'journey') = 'array'
      THEN ARRAY(
        SELECT COALESCE(elem->>'title', '')
        FROM jsonb_array_elements(data->'journey') AS elem
      )
    ELSE '{}'::text[]
  END,
  journey_texts = CASE
    WHEN cardinality(journey_texts) > 0 THEN journey_texts
    WHEN jsonb_typeof(data->'journey') = 'array'
      THEN ARRAY(
        SELECT COALESCE(elem->>'text', '')
        FROM jsonb_array_elements(data->'journey') AS elem
      )
    ELSE '{}'::text[]
  END,
  value_titles = CASE
    WHEN cardinality(value_titles) > 0 THEN value_titles
    WHEN jsonb_typeof(data->'values') = 'array'
      THEN ARRAY(
        SELECT COALESCE(elem->>'title', '')
        FROM jsonb_array_elements(data->'values') AS elem
      )
    ELSE '{}'::text[]
  END,
  value_descriptions = CASE
    WHEN cardinality(value_descriptions) > 0 THEN value_descriptions
    WHEN jsonb_typeof(data->'values') = 'array'
      THEN ARRAY(
        SELECT COALESCE(elem->>'description', '')
        FROM jsonb_array_elements(data->'values') AS elem
      )
    ELSE '{}'::text[]
  END,
  value_accents = CASE
    WHEN cardinality(value_accents) > 0 THEN value_accents
    WHEN jsonb_typeof(data->'values') = 'array'
      THEN ARRAY(
        SELECT COALESCE(elem->>'accent', '')
        FROM jsonb_array_elements(data->'values') AS elem
      )
    ELSE '{}'::text[]
  END
WHERE data IS NOT NULL AND data <> '{}'::jsonb;

UPDATE projects SET data = '{}'::jsonb WHERE data <> '{}'::jsonb;
UPDATE portfolio_items SET data = '{}'::jsonb WHERE data <> '{}'::jsonb;
UPDATE blog_posts SET data = '{}'::jsonb WHERE data <> '{}'::jsonb;
UPDATE about_content SET data = '{}'::jsonb WHERE data <> '{}'::jsonb;

-- Cover image columns (idempotent for existing databases)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '';
ALTER TABLE services ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '';

