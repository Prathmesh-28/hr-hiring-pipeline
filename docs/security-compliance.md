# Security & Compliance

## Data Privacy

- Collect only the data needed to evaluate candidates.
- Use explicit consent language on the careers page and application form.
- Store privacy notice and data retention policy links in the application footer.
- Maintain a candidate data deletion workflow for GDPR-style requests.

## Secure File Handling

- Upload resumes using signed URLs or multipart upload to AWS S3.
- Store files with private ACLs and avoid exposing raw storage links publicly.
- Validate file types and limit upload size.
- Scan uploaded documents for malware if using high volume.

## Authentication and RBAC

- HR portal requires authenticated login.
- Use strong passwords, multi-factor authentication (MFA) for admins.
- Assign roles: `ADMIN`, `HR`, `HIRING_MANAGER`.
- Protect API routes with JWTs or session cookies.
- Enforce least privilege on admin endpoints.

## API Security

- Use HTTPS for all frontend/backend communication.
- Sanitize user input and validate incoming payloads.
- Rate limit candidate submission endpoints if needed.
- Protect automation webhook endpoints with shared secrets.

## Compliance

- Audit stage transitions and event history for traceability.
- Store candidate consent event with each submission.
- Provide secure candidate portal links if candidate login is added.
- Keep onboarding documents encrypted in storage.
