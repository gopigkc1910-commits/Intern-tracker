# Database Schema

## Core Tables

### users

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | primary key |
| email | varchar unique nullable | OTP login |
| phone | varchar unique nullable | OTP login |
| full_name | varchar | |
| avatar_url | text nullable | |
| college_name | varchar nullable | |
| degree | varchar nullable | |
| branch | varchar nullable | |
| graduation_year | int nullable | |
| city | varchar nullable | |
| country | varchar nullable | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### user_profiles

| Column | Type | Notes |
|---|---|---|
| user_id | uuid pk fk users.id | one-to-one |
| bio | text nullable | |
| goals | text nullable | |
| preferred_domains | text[] | |
| preferred_locations | text[] | remote/on-site/hybrid |
| preferred_opportunity_types | text[] | internship, hackathon, etc |
| skills | text[] | |
| github_url | text nullable | |
| linkedin_url | text nullable | |
| resume_url | text nullable | |
| onboarding_completed | boolean | default false |

### opportunities

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| source_id | uuid fk opportunity_sources.id | |
| organization_id | uuid fk organizations.id nullable | |
| title | varchar | |
| slug | varchar unique | |
| type | varchar | internship, hackathon, scholarship, event |
| domain | varchar | AI, web-dev, finance |
| mode | varchar | remote, onsite, hybrid |
| description | text | |
| stipend_min | numeric nullable | |
| stipend_max | numeric nullable | |
| application_url | text | |
| eligibility_text | text nullable | |
| required_skills | text[] | |
| tags | text[] | |
| deadline_at | timestamptz nullable | |
| status | varchar | published, expired, removed |
| is_verified | boolean | |

### applications

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| user_id | uuid fk users.id | |
| opportunity_id | uuid fk opportunities.id | |
| status | varchar | saved, applied, shortlisted, rejected, accepted |
| applied_at | timestamptz nullable | |
| next_follow_up_at | timestamptz nullable | |
| note | text nullable | |

### reminders

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| user_id | uuid fk users.id | |
| opportunity_id | uuid fk opportunities.id nullable | |
| reminder_type | varchar | deadline, follow-up, digest |
| scheduled_for | timestamptz | |
| channel | varchar | email, push, in_app |
| status | varchar | pending, sent, failed |

### discussion_threads

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| author_id | uuid fk users.id | |
| title | varchar | |
| category | varchar | general, internships, hackathons |
| related_opportunity_id | uuid fk opportunities.id nullable | |

### hackathon_teams

| Column | Type | Notes |
|---|---|---|
| id | uuid pk | |
| opportunity_id | uuid fk opportunities.id | |
| owner_id | uuid fk users.id | |
| team_name | varchar | |
| required_skills | text[] | |
| max_members | int | |

## SQL Starter Schema

See [init.sql](d:\Intern Tracker\infra\postgres\init.sql) for a starter relational schema.
