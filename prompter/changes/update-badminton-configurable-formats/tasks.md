## 1. Data Model
- [x] 1.1 Extend tournament persistence to store format, supported entrant count, and entrant metadata without removing the existing event registration uniqueness constraint.
- [x] 1.2 Model active entrants and reserve assignments so singles uses one registration per entrant and doubles uses a named team with exactly two registrations.

## 2. Admin Setup
- [x] 2.1 Add an admin tournament setup flow that selects `singles` or `doubles`, chooses a supported entrant count (`4`, `8`, `16`), and validates the active roster before start.
- [x] 2.2 Add doubles team composition and reserve management to the setup flow, including validation for duplicate player assignment and incomplete teams.

## 3. Tournament Engine
- [x] 3.1 Update tournament initialization to build groups of four from the configured active entrant count and format.
- [x] 3.2 Update qualification ranking, bracket seeding, and bracket progression to work for 4-, 8-, and 16-entrant tournaments in both singles and doubles modes.

## 4. Tournament Views
- [x] 4.1 Update admin tournament management screens to show entrant labels, doubles team members, and reserve users.
- [x] 4.2 Update authenticated event tournament views to show team names and team members for doubles while keeping the screens read-only for non-admin users.

## 5. Validation
- [x] 5.1 Add or update feature and unit tests for singles setup, doubles setup, reserve exclusion, and variable-size bracket seeding.
- [x] 5.2 Run `php artisan test`.
- [x] 5.3 Run `npm run build`.
- [x] 5.4 Review `AGENTS.md` and update project guidance if the supported badminton formats or roster rules need to be documented there.
