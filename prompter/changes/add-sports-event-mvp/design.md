## Context
This project is an internal company web app for daily or weekly sports events. The app needs a simple public-facing event listing, authenticated user registration, and an admin workflow for managing venues, schedules, and registration status.

## Goals / Non-Goals
- Goals: ship the smallest useful MVP for event publishing and sign-up; keep the architecture simple for a small internal audience; support Docker-based development and VPS deployment
- Non-Goals: payments, advanced analytics, real-time updates, chat, and complex search in the first release

## Decisions
- Decision: use Laravel 12 with Inertia.js (React) and MySQL
- Alternatives considered: Laravel + Blade for simpler pages, but Inertia + React better fits the approved stack while keeping a single Laravel codebase
- Decision: model registration as a dedicated entity between users and sports events
- Alternatives considered: storing participants directly on the event, but a registration table gives cleaner constraints, timestamps, and future extensibility
- Decision: treat registration closing as an explicit event state controlled by admins
- Alternatives considered: deriving closure from start time only, but a manual close action matches the approved workflow better

## Risks / Trade-offs
- User account provisioning is still open and may affect the auth flow → start with standard Laravel auth and confirm whether users self-register or are admin-invited
- Email notifications were discussed but not finalized for MVP → keep them out of the first implementation unless explicitly requested

## Migration Plan
1. Scaffold the Laravel application
2. Add the core schema and roles
3. Build public listing and user registration
4. Build admin event management and registration closing
5. Add Docker and deployment configuration

## Open Questions
- Should registered users create their own accounts, or should admins create them?
- Should email notifications launch in MVP or move to a later phase?
