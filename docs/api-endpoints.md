# API Endpoints

Base URL: `/api/v1`

## Authentication

- `POST /auth/request-otp`
- `POST /auth/verify-otp`

## User Profile

- `GET /me`
- `PATCH /me`
- `GET /me/preferences`
- `PUT /me/preferences`
- `POST /me/resume`
- `POST /me/integrations/github`
- `POST /me/integrations/linkedin`

## Opportunities

- `GET /opportunities`
- `GET /opportunities/{slug}`
- `POST /opportunities/{id}/save`
- `DELETE /opportunities/{id}/save`
- `POST /opportunities/{id}/apply`
- `GET /opportunities/recommended`
- `GET /opportunities/trending`
- `GET /opportunities/calendar`

## Applications

- `GET /applications`
- `POST /applications`
- `PATCH /applications/{id}`
- `DELETE /applications/{id}`

## AI Features

- `POST /ai/resume-analyze`
- `POST /ai/cover-letter`
- `POST /ai/interview-questions`
- `POST /ai/chat-assistant`

## Community

- `GET /threads`
- `POST /threads`
- `GET /threads/{id}`
- `POST /threads/{id}/posts`
- `POST /teams`
- `GET /teams`
- `POST /referrals`

## Notifications

- `GET /notifications`
- `PATCH /notifications/{id}/read`
- `PUT /notification-settings`

## Admin

- `GET /admin/opportunities`
- `PATCH /admin/opportunities/{id}/status`
- `GET /admin/reports`
- `GET /admin/analytics/overview`
- `GET /admin/sources/health`
