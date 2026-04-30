-- Supabase schema for MVP candidate application tracking

create table profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text default 'HR',
  created_at timestamptz default now()
);

create table jobs (
  id text primary key,
  title text not null,
  location text,
  department text,
  description text,
  created_at timestamptz default now()
);

create table candidates (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text not null,
  last_name text not null,
  phone text,
  source text,
  current_company text,
  current_title text,
  location text,
  resume_url text,
  application_status text default 'APPLIED',
  created_at timestamptz default now()
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references candidates(id) on delete cascade,
  job_id text references jobs(id) on delete set null,
  stage text default 'APPLIED',
  status text default 'PENDING',
  source text,
  answers text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table offers (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  title text,
  salary_range text,
  equity text,
  status text default 'PENDING',
  document_url text,
  created_at timestamptz default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  type text,
  payload jsonb,
  created_at timestamptz default now()
);

-- Example seed jobs
insert into jobs (id, title, location, department, description) values
('job-frontend', 'Frontend Engineer', 'Remote', 'Engineering', 'Build customer-facing web experiences.'),
('job-product', 'Product Manager', 'Hybrid', 'Product', 'Own feature delivery and roadmap execution.');
