# Supabase / Firebase MVP Implementation

This file explains how to launch the HR hiring pipeline as a backendless MVP using Supabase or Firebase.

## Supabase MVP

### What it covers

- Candidate application form hosted in Next.js
- Resume upload directly to Supabase Storage
- Candidate + application data stored in Supabase PostgreSQL
- HR login using Supabase Auth
- HR dashboard reading applications and candidate details
- Workflow hooks for automation and notifications

### Supabase tables

Use the SQL schema in `docs/supabase-schema.sql`.

### Environment variables

Create `apps/supabase-mvp/.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Setup steps

1. Create a Supabase project.
2. Create the `resumes` storage bucket and mark it public or use signed URLs.
3. Run the SQL in `docs/supabase-schema.sql`.
4. Seed a few roles and job rows.
5. Add HR users in Supabase Auth and set their role metadata to `HR`.
6. Run the app with `cd apps/supabase-mvp && yarn install && yarn dev`.

### Extending to automation

- Use Supabase Edge Functions or `POST /webhooks/automation` from the main API repo to trigger Slack, SendGrid, or Twilio workflows.
- Use Supabase Realtime to notify HR dashboard on new applications.
- Integrate OpenAI with a Supabase Edge Function to parse resumes and assign a fit score.
- The Firebase MVP implementation is available in `apps/firebase-mvp`.

## Firebase MVP

### Recommended stack

- Firebase Auth for HR login
- Firestore for candidate and application data
- Firebase Storage for resumes
- Cloud Functions for background automation and AI scoring
- Firebase Hosting for the frontend

### MVP flow

1. Candidate submits the form to Firestore.
2. Cloud Function triggers on new application.
3. The function parses resume text using OpenAI and stores metadata back to Firestore.
4. Another function sends a welcome email through SendGrid or Firebase Extensions.
5. HR dashboard reads Firestore collections using admin-only rules.

### Security notes

- Use strict Firestore security rules to allow only authenticated HR users to read application data.
- Use bucket rules to restrict resume access.
- Store consent and data retention metadata with every candidate record.
