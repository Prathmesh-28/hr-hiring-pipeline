# Firebase MVP Setup

This document explains how to use the `apps/firebase-mvp` app as a backendless hiring MVP.

## What it includes

- Candidate application portal built in Next.js
- Resume upload to Firebase Storage
- Candidate/application data stored in Firestore
- HR dashboard protected by Firebase Auth

## Firestore collections

Use the following collections for the MVP:

- `jobs` — open roles with fields: `title`, `location`, `description`, `createdAt`
- `applications` — candidate submissions with fields:
  - `email`
  - `firstName`
  - `lastName`
  - `phone`
  - `source`
  - `currentCompany`
  - `currentTitle`
  - `location`
  - `resumeUrl`
  - `jobId`
  - `answers`
  - `stage`
  - `status`
  - `createdAt`

## Environment variables

Create `apps/firebase-mvp/.env.local` with:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Setup

1. Create a Firebase project.
2. Enable Firestore and Storage.
3. Enable Email/Password sign-in in Firebase Auth.
4. Seed the `jobs` collection with roles.
5. Run the app:
   - `cd apps/firebase-mvp`
   - `yarn install`
   - `yarn dev`

## Notes

- Candidate resumes are uploaded to the `resumes` storage folder.
- HR users must be created manually in Firebase Auth.
- For automated workflows, add Firebase Functions to trigger on `applications` writes and call OpenAI or email services.
