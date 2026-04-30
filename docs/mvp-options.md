# MVP and Production Architecture Options

## A. Low-cost MVP Option

Use this path when you need a fast, low-maintenance setup.

- Frontend: Next.js + React
- Backend: Supabase or Firebase Functions
- Database: Supabase PostgreSQL or Firebase Firestore
- Authentication: Supabase Auth or Firebase Auth
- File storage: Supabase Storage or Firebase Storage
- AI: OpenAI API for resume parse and fit scoring
- Automations: Zapier or n8n for email workflows, reminders, and calendar invites
- Communication: SendGrid for email, Twilio for SMS/WhatsApp
- Hosting: Vercel for frontend, Supabase / Firebase / Railway for serverless backend

### MVP Data Flow

1. Candidate completes form and uploads resume.
2. Resume is saved to Supabase Storage / Firebase Storage.
3. Candidate record and application metadata are saved to the database.
4. A serverless function invokes OpenAI and stores parsed resume text + scores.
5. Zapier/n8n watches new applications and sends confirmation emails.
6. HR dashboard reads from the same database and updates candidate stages.

### MVP Advantages

- Fastest to build and deploy
- Minimal infrastructure
- Good for early-stage candidate intake

### MVP Tradeoffs

- Less control over custom business logic
- Harder to support complex multi-step workflows
- Not ideal for enterprise-level compliance without additional layers

## B. Production-scalable Option

Use this path for enterprise readiness and long-term reliability.

- Frontend: Next.js with TypeScript and component-driven UI
- Backend: Node.js + Express / NestJS + Prisma
- Database: PostgreSQL with normalized schema, audit logging, and indexing
- File storage: AWS S3 with signed URLs and private access
- Background workers: Redis + BullMQ (for automation and async AI tasks)
- AI: OpenAI API + optional custom ranking microservice
- Automations: n8n / custom backend workflow engine / AWS EventBridge
- Communication: SendGrid, Twilio, WhatsApp Business API
- Hosting: Vercel for frontend, AWS ECS/EKS or Fly.io for backend, AWS RDS for database

### Production Advantages

- Fully customizable automation and security
- Scales from startup to enterprise
- Easier audit and compliance controls
- Supports interview scheduling, offer automation, onboarding, and integrations
