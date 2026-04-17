# Change: Support configurable singles and doubles badminton tournaments

## Why
The current badminton tournament flow is hard-coded to a fixed 16-player singles setup. The requested badminton adjustment needs admin-configured tournament size, explicit singles or doubles setup, optional reserve users, and clearer tournament participant display while preserving the existing event registration flow as the roster source.

## What Changes
- Add badminton tournament setup with selectable format (`singles` or `doubles`) and supported active entrant counts of `4`, `8`, or `16`.
- Use confirmed event registrations as the source roster, letting admins compose active entrants plus optional reserves before tournament start.
- Require doubles entrants to have a team name and exactly two assigned registered users.
- Generalize group-stage, qualification, and bracket seeding rules from a fixed 16-player flow to the configured entrant count.
- Show team names, team members, and reserves in admin and authenticated tournament views.

## Impact
- Affected specs: `badminton-tournament`
- Affected code: `app/Models/Registration.php`, `app/Models/Tournament.php`, `app/Services/Tournaments/*`, `app/Http/Controllers/Admin/EventController.php`, `app/Http/Controllers/Admin/TournamentController.php`, `app/Http/Controllers/EventController.php`, `resources/js/Pages/Admin/Events/Show.jsx`, `resources/js/Pages/Events/Show.jsx`, `tests/Feature/TournamentManagementTest.php`, related migrations
