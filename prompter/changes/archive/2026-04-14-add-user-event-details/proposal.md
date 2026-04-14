# Change: Add authenticated event details page

## Why
Users can browse events and register, but they cannot open a dedicated event page to review full details or see who has already joined. Adding an authenticated detail view makes the participant list discoverable without exposing names publicly.

## What Changes
- Add an authenticated event details page for a single sports event
- Show the event schedule, venue details, registration status, and participant list on that page
- Restrict participant names to authenticated users and redirect guests to login

## Impact
- Affected specs: `sports-event-app`
- Affected code: `routes/web.php`, `app/Http/Controllers/EventController.php`, `resources/js/Pages/Events/*`, `tests/Feature/*`
