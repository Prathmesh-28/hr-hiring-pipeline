# HR Candidate Screening & Hiring Pipeline

A production-ready, enterprise-capable HR recruiting platform scaffold built for startup-to-scale growth. This repo includes:

- `apps/career-portal`: candidate-facing application form with resume upload, structured questions, and mobile-first UX
- `apps/hr-dashboard`: HR admin portal with pipeline, search, filters, interview scheduling, and role-based access controls
- `apps/supabase-mvp`: Supabase-powered MVP candidate portal and HR workflow
- `apps/firebase-mvp`: Firebase-powered MVP candidate portal and HR dashboard
- `services/api`: Node.js backend with PostgreSQL/Prisma, AI screening, DocuSign and workflow automation hooks
- `docs`: architecture, workflow, security, and deployment guidance

## Vision

A complete end-to-end hiring system that replaces Google Forms with a secure, custom candidate experience, real-time HR workflows, automated screening, offer generation, and onboarding tracking.

## Key Features

- Candidate application form with resume upload and dynamic question flow
- Backend data model for candidates, applications, stages, feedback, offers, notes, and audit logs
- AI-powered resume parsing and job-fit scoring
- Secure HR dashboard with Kanban pipeline, search, tagging, filters, and bulk actions
- Role-based access control for HR, Hiring Managers, and Admins
- Automated notifications, candidate reminders, and stage progression
- Offer letter templating, PDF generation, e-signature readiness, and onboarding task management
- Analytics dashboards for funnel metrics, source effectiveness, and cycle time

## Implementation Options

### A. Low-cost MVP

- Frontend: Next.js + React
- Backend: Supabase or Firebase (Auth + database + storage)
- Database: PostgreSQL via Supabase or Firestore
- File Storage: Supabase Storage or Firebase Storage
- Automation: Zapier / n8n / custom serverless functions
- AI: OpenAI Embeddings + GPT summarization
- Communication: SendGrid + Twilio / WhatsApp API
- Hosting: Vercel for frontend + Supabase / Railway / Render for backend

### B. Scalable Production System

- Frontend: Next.js with TypeScript and modular component library
- Backend: Node.js + Express / NestJS + Prisma
- Database: PostgreSQL with strong relational schema
- File Storage: AWS S3 behind signed URLs
- Automation: n8n / custom backend workers with BullMQ, serverless events
- AI: OpenAI + custom ranking microservice
- Communication: SendGrid + Twilio / WhatsApp Business API
- Hosting: Vercel (frontend) + AWS ECS / EKS / Fly.io for backend

For MVP variations, see `docs/mvp-options.md`, `docs/supabase-firebase-mvp.md`, and `docs/firebase-mvp-setup.md` for Supabase/Firebase deployment patterns.

## Quick Start

1. Clone the repo and install dependencies in each app/service folder.
2. Configure environment variables in `apps/**/.env.local` and `services/api/.env`.
3. Run backend and frontend apps locally.
4. Deploy using your preferred cloud provider.

> See `docs/architecture.md`, `docs/implementation-plan.md`, and `docs/integration-overview.md` for full deployment and execution guidance.
