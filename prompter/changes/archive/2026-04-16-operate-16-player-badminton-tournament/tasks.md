# Tasks

1.  [x] **Domain Modeling & Backend Scaffolding**: Created `Tournament`, `GroupStanding`, and `TournamentMatch` persistence with foreign keys to `SportsEvent` and `Registration`.
    *Validation*: `php artisan migrate:fresh --seed` passed, and model factory coverage was added in `tests/Feature/TournamentManagementTest.php`.
2.  [x] **Tournament Initialization Action**: Added a tournament start service that requires exactly 16 registrations, closes registration, and generates the 4x4 round-robin group stage setup.
    *Validation*: Feature coverage asserts a validation error with 15 users and verifies 24 round-robin group-stage matches are generated for 16 registrations.
3.  [x] **Admin Match Result Entry API**: Added `POST /admin/matches/{match}/score` for admin-only, idempotent score submission with transactional row locking.
    *Validation*: Feature coverage verifies repeat submissions do not corrupt standings and that winners receive 3 points while losers receive 0.
4.  [x] **Tiebreaker Logic**: Implemented backend group standing ranking with Point Differential, then Head-to-Head, then deterministic coin-flip fallback.
    *Validation*: `tests/Unit/RefreshGroupStandingsTest.php` verifies point-differential ordering and head-to-head resolution.
5.  [x] **Bracket Generation Logic**: Added automatic bracket seeding after group completion, promoting the top 8 players to the Upper Bracket and the bottom 8 to the Lower Bracket.
    *Validation*: Feature coverage completes the group stage and verifies all 16 first-round bracket slots (8 upper, 8 lower) are populated.
6.  [x] **Bracket Progression Service**: Extended score processing to advance winners, drop Upper Bracket losers into Lower Bracket, and eliminate Lower Bracket losers.
    *Validation*: Feature coverage records an Upper Bracket loss and verifies the loser is placed into the next Lower Bracket round.
7.  [x] **Admin UI Result Management**: Added admin tournament controls with start action, pending match visibility, inline score forms, and disabled submit states during Inertia requests.
    *Validation*: `npm run build` passed, and the UI wiring uses `useForm` processing state for safe repeated submissions.
8.  [x] **Player UI (Read-Only) Standings Insight**: Expanded the authenticated event details screen with read-only tournament standings, personal match history, and bracket overview.
    *Validation*: Feature coverage verifies tournament data is rendered on the player event details payload, and the player-facing screen exposes no score-entry controls.
