# Bonus Integrations

## Slack Integration

- Send pipeline alerts to a dedicated Slack channel when candidates move to `SCREENING`, `INTERVIEW`, or `OFFER`.
- Use Slack Incoming Webhooks or the Slack Events API.
- Example: when AI score > 80, post candidate summary and resume link to `#talent-alerts`.
- Use slash commands to approve fast-track decisions from Slack.

## Notion Integration

- Create a Notion database for active candidates.
- Use Notion API to sync candidate status, notes, and interview schedules.
- Example properties: `Name`, `Role`, `Stage`, `Fit Score`, `Next Interview`, `Owner`.
- Store links to application records and offer documents.

## AI Chatbot for Candidate Queries

- Add a simple chat widget to the career page for FAQs and application status questions.
- Use OpenAI or a custom intent engine to answer questions like:
  - "How do I update my application?"
  - "What documents do I need for onboarding?"
  - "When will I hear back?"
- Provide a fallback to collect candidate contact details and route unanswered queries to HR.

## Multi-Role Job Support

- Store jobs in a `JobOpening` table with role, department, level, location, skills, and requisition owner.
- Present open roles on the careers page as cards with `Apply` buttons.
- Allow multi-role application submission or internal referral tagging.
- In the HR dashboard, filter by job family, hiring manager, or region.
