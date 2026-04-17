## 1. Implementation
- [x] 1.1 Update tournament qualification logic to calculate a single overall ranking across all completed group-stage standings.
- [x] 1.2 Update bracket seeding so qualification ranks 1-8 populate the upper bracket and ranks 9-16 populate the lower bracket using the approved seed lines.
- [x] 1.3 Expose qualification rank and bracket placement in admin and participant tournament payloads.
- [x] 1.4 Update admin and participant tournament screens to display the overall qualification outcome alongside existing group standings.
- [x] 1.5 Update feature coverage for group-stage completion, cross-group qualification ranking, bracket population, and read-only tournament visibility.

## 2. Validation
- [x] 2.1 Run `php artisan test` (currently blocked by a pre-existing SQLite migration issue: an `alter table matches` migration runs before the `matches` table exists in the test database).
- [x] 2.2 Run `npm run build`

## Post-Implementation
- [x] No `AGENTS.md` update required; the implementation stays within the existing project-level agent guidance.
