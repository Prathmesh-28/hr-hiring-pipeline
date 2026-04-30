# Full System Integration Overview

This document explains how the candidate portal, backend workflows, HR dashboard, automation hooks, scheduling, offer letters, and onboarding work together.

## Core Integration Points

1. Candidate Portal (`apps/career-portal`)
   - Submits applications via `POST /applications/submit`
   - Uploads resumes and structured answers directly to backend
   - Uses job metadata from `GET /applications/jobs`

2. Backend API (`services/api`)
   - Stores candidate, application, and stage data in PostgreSQL
   - Saves resumes and generated documents to AWS S3
   - Runs AI analysis via OpenAI for resume parsing and fit scoring
   - Exposes HR operations via `/admin` routes

3. HR Dashboard (`apps/hr-dashboard`)
   - Authenticates HR users via `/auth/login`
   - Displays candidate pipeline and stage information
   - Allows stage transitions and trigger-based actions

4. Automation Hooks
   - `/webhooks/automation` accepts Zapier/n8n webhook forwarding
   - n8n workflows are documented in `docs/n8n-workflows.md`
   - DocuSign envelope creation is documented in `docs/docusign-integration.md`
   - Use automation platform to send emails, Slack notifications, or calendar invites
   - Example workflow: New application detected → score > 80 → Slack alert + email to hiring manager

5. Interview Scheduling
   - `scheduleZoomMeeting()` provides a placeholder Zoom meeting object
   - `createGoogleCalendarEvent()` provides a placeholder calendar link
   - Use Zoom API or Google Calendar API for production scheduling events

6. Offer Letter Generation
   - HR creates offers through `POST /admin/offers`
   - Backend generates a PDF with candidate and role details
   - PDF is uploaded to S3 and candidate receives an email link
   - Add DocuSign or Zoho Sign callbacks via `/webhooks/docusign`

## Sample End-to-End Flow

1. Candidate applies on the career portal.
2. Backend saves the application, uploads resume, and runs AI scoring.
3. If the candidate is a strong fit, the backend tags them and optionally forwards an automation webhook.
4. HR sees the candidate in the dashboard and moves them to `INTERVIEW`.
5. The system schedules a meeting and sends invite emails.
6. After interview feedback, HR creates an offer.
7. Backend generates offer PDF and emails the candidate.
8. Candidate signs the offer and onboarding tasks are created.

## Jobs and Multi-role Support

- Store job openings centrally in the database.
- Allow candidates to select the role they are applying for.
- Filter HR dashboard by job, hiring manager, or location.

## Automation Topologies

- Custom backend worker: handle AI scoring, reminders, and stage-based rules.
- n8n/Zapier: connect external services for Slack, email, interview scheduling, and e-sign workflows.
- Webhooks: keep external systems synced with job application events.

## Recommended Deployment Pattern

- Frontend on Vercel deliver rapid UI updates
- Backend on AWS ECS / Fly.io for API reliability
- PostgreSQL on AWS RDS or Supabase for secure relational storage
- AWS S3 for resumes and documents
- Redis/BullMQ for workflow jobs if automation volume grows
