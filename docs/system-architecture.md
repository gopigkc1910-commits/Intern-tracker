# System Architecture

## Goals

- Aggregate student opportunities from fragmented sources
- Deliver personalized recommendations and reminders
- Support tracking, collaboration, and admin moderation
- Scale to high read traffic with fast search and notifications

## High-Level Architecture

```text
                    +---------------------------+
                    |     External Sources      |
                    | LinkedIn, Unstop, Careers |
                    +------------+--------------+
                                 |
                                 v
                      +----------------------+
                      | Ingestion Pipelines  |
                      | Scrapers / Connectors|
                      +----------+-----------+
                                 |
                                 v
+--------------+       +----------------------+       +------------------+
| Next.js Web  |<----->| FastAPI REST Backend |<----->| PostgreSQL       |
| PWA / Mobile |       | Auth, Search, AI,    |       | Core relational  |
+------+-------+       | Tracking, Community   |       +--------+---------+
       |               +-----+-----------+-----+                |
       |                     |           |                      |
       |                     |           v                      v
       |                     |    +-------------+         +-----------+
       |                     |    | Redis Cache |         | pgvector  |
       |                     |    +-------------+         | embeddings|
       |                     |                            +-----------+
       |                     v
       |              +--------------+
       |              | Notification |
       |              | Email / Push |
       |              +------+-------+
       |                     |
       v                     v
+---------------+     +--------------+
| Chrome Ext.   |     | Firebase/FCM |
| Save on page  |     | mobile push  |
+---------------+     +--------------+
```

## Core Services

### 1. Identity and Profile

- OTP login by email or mobile
- Skill graph, interests, branch, year, goals
- Resume uploads and profile enrichment

### 2. Opportunity Aggregation

- Source connectors for company pages, student platforms, and manual admin uploads
- Normalization pipeline for deadlines, eligibility, domains, and tags
- Duplicate detection based on canonical URL, title similarity, and organization

### 3. Search and Recommendations

- Filtered search over structured opportunity metadata
- Recommendation engine using profile, saved history, and embeddings
- Trending opportunities based on clicks, saves, applications, and deadlines

### 4. Tracking and Reminders

- Saved/applied pipelines
- Calendar aggregation
- Reminder scheduler for deadline windows like 7 days, 3 days, and 24 hours

### 5. AI Assist

- Resume analysis against target role
- Cover letter generation from profile + opportunity
- Interview question generation based on role and skills

### 6. Community

- Forums, comments, referrals, and hackathon team formation
- Moderation, spam detection, and reporting

### 7. Admin

- Listing moderation
- Source health monitoring
- Fraud/spam review queue
- Analytics and engagement metrics

## Deployment

- Frontend on Vercel or containers
- Backend on ECS, Fly.io, Railway, Render, or Kubernetes
- Managed PostgreSQL + Redis
- Background workers for scraping, reminders, digests, and AI jobs
