# DocuSign Integration

This file describes the DocuSign envelope flow for the HR hiring pipeline.

## Endpoint

The backend exposes:

- `POST /admin/offers/send-docusign`

## Payload

```json
{
  "applicationId": "<application-id>",
  "title": "Senior Product Manager",
  "level": "L3",
  "salaryRange": "120k-140k",
  "equity": "0.5%",
  "startDate": "2026-06-15",
  "emailSubject": "Your offer letter from Our Company",
  "emailBlurb": "Please review and sign your offer letter."
}
```

## What it does

1. Generates a PDF offer letter via `services/document.ts`.
2. Uploads the PDF to AWS S3.
3. Sends the document to DocuSign via the REST API.
4. Stores the DocuSign envelope ID in the `Offer` record.
5. Creates an event log entry in `events`.

## Required environment variables

- `DOCUSIGN_ACCOUNT_ID`
- `DOCUSIGN_ACCESS_TOKEN`
- `DOCUSIGN_BASE_URL`
- `DOCUSIGN_WEBHOOK_SECRET`

## Webhook callback

The backend listens at `POST /webhooks/docusign` and updates the offer status when the envelope reaches:

- `completed` → `ACCEPTED`
- `declined` → `DECLINED`

## Notes

- Use the DocuSign demo environment for testing (`https://demo.docusign.net/restapi`).
- For production, swap `DOCUSIGN_BASE_URL` to the production base path.
- If you want embedded signing, add a recipient view creation step using DocuSign's `views/recipient` endpoint.
