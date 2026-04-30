# Deployment Guide

## Backend on Render

The API service lives in `services/api` and should be deployed on Render as a Node web service.

- Repository root: this monorepo
- Root build command: `yarn install && yarn workspace api build`
- Start command: `cd services/api && yarn start`
- Health check path: `/health`

Required Render environment variables:

- `DATABASE_URL` - your PostgreSQL connection string
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET`
- `SENDGRID_API_KEY`
- `JWT_SECRET`
- `DOCUSIGN_ACCOUNT_ID`
- `DOCUSIGN_ACCESS_TOKEN`
- `TIMEZONE` (optional, default `UTC`)

Render will deploy the backend at a public URL like `https://<your-service>.onrender.com`.

## Frontend on Vercel

The candidate portal and HR dashboard are separate Next.js apps and should be deployed individually:

- `apps/career-portal` → Candidate application portal
- `apps/hr-dashboard` → HR dashboard
- Optional: `apps/supabase-mvp` and `apps/firebase-mvp` for MVP variations

For each Vercel project:

1. Set the root directory to the app folder, e.g. `apps/career-portal`.
2. Build command: `npm run build` or `yarn build`.
3. Output directory: automatically detected for Next.js.
4. Set environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://<your-render-backend>.onrender.com`

## Wiring the apps

- `apps/career-portal/pages/apply.tsx` now uses `NEXT_PUBLIC_API_URL`.
- `apps/hr-dashboard/pages/login.tsx` and `apps/hr-dashboard/pages/index.tsx` now use `NEXT_PUBLIC_API_URL`.

When deployed, the candidate portal and HR dashboard will call the Render backend instead of `localhost`.

## Notes

- The Supabase and Firebase MVP apps are independent and use their own provider configs.
- If you want a unified production deployment, use the Render backend URL as `NEXT_PUBLIC_API_URL` in the Vercel projects.
