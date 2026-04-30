# n8n Workflow Examples for HR Automation

These workflows show how to wire the HR hiring pipeline with n8n for email, Slack, interview scheduling, and offer automation.

## 1. Candidate Submission → AI Screening → Slack Alert

Trigger: HTTP Request node

Nodes:
- HTTP Request: `POST /applications/submit` webhooks from the candidate portal
- Function: parse `fitScore` from response or fetched application record
- If: check `fitScore > 75`
- Slack: send a message to `#hiring-alerts` with candidate name, job, and fit score
- HTTP Request (optional): update candidate tags in your backend

## 2. Stage Transition → Email / WhatsApp Notification

Trigger: Webhook when stage updates in the backend

Nodes:
- Webhook: receive event payload from `PATCH /admin/applications/:id/stage`
- HTTP Request: fetch application details from `GET /admin/candidates`
- Switch: branch by `stage` value
- Email: SendGrid node to email candidate stage change
- Twilio: send SMS/WhatsApp update if phone is available

## 3. Interview Scheduling → Calendar Invite

Trigger: HTTP Request from the HR app after interview schedule is created

Nodes:
- HTTP Request: backend `POST /admin/interviews/schedule`
- Function: generate interview summary
- Google Calendar: create event or send candidate calendar link
- Slack: notify the recruiter/hiring manager with meeting details

## 4. Offer Letter Generated → DocuSign / Email

Trigger: Offer creation response from backend

Nodes:
- HTTP Request: `POST /admin/offers`
- Function: attach offer PDF URL or document metadata
- DocuSign: create envelope for e-signature
- Email: notify candidate with sign link and next steps
- Webhook: listen for DocuSign callback to update acceptance status

## 5. Reminder Automation for Unreviewed Applications

Trigger: Cron node (daily)

Nodes:
- HTTP Request: query backend API for applications in `APPLIED` older than 3 days
- Filter: find candidates without reviewer activity
- Slack/Email: send reminder to the recruiting team or hiring manager

## Webhook Integration

Use the backend endpoint `POST /webhooks/automation` to forward events to external automation platforms.

Example payload:

```json
{
  "event": "application.submitted",
  "payload": {
    "applicationId": "...",
    "candidateEmail": "..."
  },
  "targetUrl": "https://n8n.example.com/webhook/your-webhook-id"
}
```

## Best Practices

- Store all candidate events in the backend event log to keep the HR dashboard authoritative.
- Use RBAC to ensure only authenticated HR users can trigger automation actions.
- Keep webhook secrets in environment variables and verify them before processing.
- Use n8n credentials for SendGrid/Twilio/Slack so workflow logic stays separate from code.
