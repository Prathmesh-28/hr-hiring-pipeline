# Automation Logic & Workflow Flows

## Candidate Application Workflow

Trigger: Candidate submits application form

1. Validate payload and save candidate + application record
2. Upload resume to storage
3. Send application confirmation email via SendGrid
4. Call AI screening function
5. Persist score and fit metadata
6. If fit score > threshold, auto-shortlist and tag as `Top Candidate`
7. Create event record `APPLICATION_SUBMITTED`

## Stage Update Workflow

Trigger: HR updates candidate stage

1. Persist stage transition
2. Create event `STAGE_UPDATED`
3. If stage becomes `INTERVIEW`, send calendar scheduling link and candidate instructions
4. If stage becomes `OFFER`, generate offer document and email candidate

## Reminder Workflow

Trigger: Application older than 3 days in `APPLIED` stage without review

1. Send internal Slack alert to hiring team
2. Optionally send candidate reminder email to complete missing fields

## Offer Automation Flow

Trigger: HR marks candidate as `OFFER`

1. Render offer letter template with candidate data
2. Generate PDF via backend service
3. Upload PDF to S3 and store `documentUrl`
4. Send email with DocuSign/Zoho Sign link for e-signature
5. Create event `OFFER_GENERATED`

## Onboarding Workflow

Trigger: Offer accepted

1. Move application to `HIRED`
2. Send onboarding portal invite
3. Request document uploads: ID, signed offer, background verification forms
4. Create HR checklist tasks and candidate checklist tasks
5. Track progress in onboarding dashboard

## Sample API Flow

- `POST /applications/submit` - candidate submit
- `POST /auth/login` - HR auth
- `GET /admin/candidates` - pipeline listing
- `PATCH /admin/applications/:id/stage` - stage update
- `POST /admin/offers` - offer generation
- `POST /webhooks/zoom` - interview scheduling callback
- `POST /webhooks/docusign` - e-sign status callback

## Example Trigger / Condition / Action Rules

1. Trigger: `application.submitted`
   - Condition: `fitScore > 75`
   - Action: Mark application `flagged=true`, send hiring manager Slack alert

2. Trigger: `stage.updated`
   - Condition: `stage === INTERVIEW`
   - Action: Email candidate interview prep link and attach Zoom meeting request

3. Trigger: `offer.status === SENT`
   - Condition: `acceptedAt != null`
   - Action: Move stage to `HIRED`, create onboarding task list
