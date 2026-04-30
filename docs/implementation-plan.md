# Implementation Plan

## Phase 1: MVP Setup

1. Bootstrap monorepo with `apps/career-portal`, `apps/hr-dashboard`, `services/api`.
2. Build Next.js application form with resume upload and JSON schema for application fields.
3. Implement backend API endpoints:
   - `POST /applications/submit`
   - `GET /applications/jobs`
   - `POST /auth/login`
   - `GET /admin/candidates`
   - `PATCH /admin/applications/:id/stage`
   - `POST /admin/offers`
   - `POST /webhooks/automation`
4. Use PostgreSQL + Prisma for data modeling.
5. Add file upload support with signed S3 uploads.
6. Add basic HR dashboard pages and candidate profile layout.
7. Add AI resume parsing service stub.
8. Add RBAC with roles: `ADMIN`, `HR`, `HIRING_MANAGER`.

## Phase 2: Screening & Automation

1. Implement OpenAI integration for resume OCR/text analysis and fit score.
2. Add pipeline stage automation and auto-shortlist rules.
3. Add automation triggers for email/SMS updates and reminders.
4. Add analytics dashboard for funnels, time-to-hire, and source tracking.

## Phase 3: Assessments, Interview, Offer, Onboarding

1. Add integration placeholders for assessment platforms.
2. Add interview scheduling page and calendar sync.
3. Build offer letter template engine and PDF generation endpoint.
4. Add document upload portal for selected candidates.
5. Build onboarding task checklist and background verification status.

## Deployment

- Frontend: Vercel
- Backend: AWS ECS / Fly.io / Railway
- Database: AWS RDS / Supabase PostgreSQL
- Storage: AWS S3
- Worker queue: Redis / managed queue

## Environment Variables

- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `SENDGRID_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `S3_BUCKET_NAME`
- `S3_REGION`
- `S3_ACCESS_KEY_ID`
- `S3_SECRET_ACCESS_KEY`

## Execution Steps

1. Install dependencies: `yarn install`
2. Start API: `yarn dev:api`
3. Start candidate portal: `yarn dev:career`
4. Start HR dashboard: `yarn dev:dashboard`
5. Use `psql` or Prisma Studio to inspect tables.
