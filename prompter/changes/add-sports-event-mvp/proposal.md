# Change: Add Sports Event MVP

## Why
The project needs a first production-ready scope for managing internal sports events without relying on manual chat coordination. A focused MVP will let admins publish events and let employees join a participant list until registration is closed.

## What Changes
- Add an MVP capability for public event listing, authenticated user registration, and admin event management
- Define the core roles, data model, and registration lifecycle for sports events
- Standardize the initial implementation target as Laravel 12 with Inertia.js (React), MySQL, Docker, and VPS deployment

## Impact
- Affected specs: `sports-event-app`
- Affected code: Laravel app scaffold, authentication and authorization, event and venue management, participant registration flow, Docker and deployment setup
