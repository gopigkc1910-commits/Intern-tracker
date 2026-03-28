create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email varchar(255) unique,
  phone varchar(32) unique,
  full_name varchar(255) not null,
  college_name varchar(255),
  degree varchar(100),
  branch varchar(100),
  graduation_year int,
  city varchar(120),
  country varchar(120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  bio text,
  goals text,
  preferred_domains text[] default '{}',
  preferred_locations text[] default '{}',
  preferred_opportunity_types text[] default '{}',
  skills text[] default '{}',
  github_url text,
  linkedin_url text,
  resume_url text,
  onboarding_completed boolean not null default false
);

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  website_url text,
  logo_url text,
  type varchar(50) not null,
  created_at timestamptz not null default now()
);

create table if not exists opportunity_sources (
  id uuid primary key default gen_random_uuid(),
  source_name varchar(120) not null,
  base_url text,
  connector_type varchar(50) not null,
  is_active boolean not null default true,
  last_synced_at timestamptz
);

create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references opportunity_sources(id),
  organization_id uuid references organizations(id),
  title varchar(255) not null,
  slug varchar(255) not null unique,
  type varchar(50) not null,
  domain varchar(100) not null,
  mode varchar(30) not null,
  location_text varchar(255),
  description text not null,
  stipend_min numeric(10,2),
  stipend_max numeric(10,2),
  currency varchar(16),
  application_url text not null,
  canonical_url text not null,
  eligibility_text text,
  required_skills text[] default '{}',
  tags text[] default '{}',
  deadline_at timestamptz,
  status varchar(30) not null default 'published',
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_stipend check (stipend_min <= stipend_max or (stipend_min is null or stipend_max is null))
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id),
  opportunity_id uuid not null references opportunities(id),
  status varchar(30) not null default 'saved',
  applied_at timestamptz,
  next_follow_up_at timestamptz,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, opportunity_id)
);

create table if not exists feedback_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  category varchar(50) not null,
  message text not null,
  name varchar(255),
  email varchar(255),
  status varchar(30) not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  label varchar(255) not null,
  search varchar(255),
  type varchar(50),
  mode varchar(30),
  verified boolean not null default false,
  deadline_days int,
  paid_only boolean not null default false,
  min_stipend numeric(10,2),
  created_at timestamptz not null default now()
);

create index if not exists idx_opportunities_type on opportunities(type);
create index if not exists idx_opportunities_domain on opportunities(domain);
create index if not exists idx_opportunities_deadline on opportunities(deadline_at);
create index if not exists idx_applications_user on applications(user_id);
create index if not exists idx_feedback_created_at on feedback_submissions(created_at);
create index if not exists idx_saved_searches_user on saved_searches(user_id);
