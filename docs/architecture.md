# Architecture Overview

## System Layers

1. Frontend
   - `apps/career-portal`: public-facing candidate application form and job listing page
   - `apps/hr-dashboard`: internal HR portal for candidate review, pipeline management, and analytics

2. Backend
   - `services/api`: REST API for candidate submissions, authentication, application workflows, AI scoring, notifications, and offer generation
   - Optional microservices for resume parsing, document generation, and audit logging

3. Data Storage
   - PostgreSQL for relational entities: candidates, applications, stages, feedback, offers, users, permissions, events
   - AWS S3 for resume, document, and verification file storage
   - Redis / BullMQ for background jobs / workflow automation

4. External Integrations
   - OpenAI for resume parsing, scoring, and candidate matching
   - SendGrid for email notifications
   - Twilio / WhatsApp API for SMS updates
   - Calendar APIs / Zoom for interview scheduling
   - DocuSign / Zoho Sign for offer e-signature
   - Slack / Notion for internal alerts and tracking

## Textual Architecture Diagram

```
[ Candidate Portal ] --> [ API Gateway / Express ] --> [PostgreSQL]
                                        |                [S3]
                                        |                [Redis]
                                        v
                                  [AI Screening Service]
                                        |
                                        v
                                 [Notification Service]
                                        |
                 ---------------------------------------------
                 |            |             |               |
             [SendGrid]   [Twilio]    [Zoom API]     [DocuSign]

[ HR Dashboard ] --> [ API Gateway / Express ] --> [PostgreSQL]
                                           |
                                           v
                                      [Workflow Engine]
``` 

## Candidate Flow

1. Candidate lands on careers page and begins application
2. Candidate uploads resume and fills dynamic screening fields
3. Form submits to API and saves application record
4. Resume and structured answers are parsed via AI service
5. Candidate is assigned a fit score and enters the Kanban pipeline
6. HR team reviews candidate profile and updates stage
7. Automated workflows send emails, schedule interviews, and generate offer letters
8. Hired candidates enter onboarding workflow and task checklist
