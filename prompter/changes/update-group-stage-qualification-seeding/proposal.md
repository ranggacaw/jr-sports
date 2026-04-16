# Change: Update Group-Stage Qualification Seeding

## Why
The current tournament flow already uses a group stage, but bracket qualification is locked to finishing position within each group. The requested behavior is to keep the group stage and instead rank all 16 players together after group play so the strongest overall performers enter the upper bracket and the remaining players enter the lower bracket.

## What Changes
- Keep the fixed 16-player tournament and 4 groups of 4 group-stage format.
- Add an overall qualification ranking across all 16 players after group-stage completion.
- Rank players primarily by total points, then point differential, with deterministic fallback rules for any remaining ties.
- Seed qualification ranks 1-8 into the upper bracket and ranks 9-16 into the lower bracket.
- Update admin and participant tournament views to show qualification outcome and bracket placement derived from the overall ranking.

## Impact
- Affected specs: `badminton-tournament`
- Affected code: `app/Services/Tournaments/RefreshGroupStandings.php`, `app/Services/Tournaments/SeedBracket.php`, `app/Http/Controllers/EventController.php`, `app/Http/Controllers/Admin/EventController.php`, tournament pages in `resources/js/Pages/`, and tournament feature tests
