## Context
JR Sports already starts tournaments in a 4-group group stage and then seeds upper and lower brackets from per-group finishing positions. The requested change preserves the current tournament lifecycle but changes qualification from group-relative placement to event-wide placement after group play.

## Goals / Non-Goals
- Goals:
- Keep the current 16-player tournament lifecycle and group-stage-first flow.
- Rank all 16 players after group-stage completion and use that ranking to split upper and lower bracket entrants.
- Keep the implementation as small as possible by reusing existing standings data and bracket topology.
- Non-Goals:
- Changing tournament size, removing groups, or redesigning the double-elimination topology.
- Introducing live scoring or public spectator features.
- Adding a separate persistence model unless existing standings data proves insufficient.

## Decisions
- Decision: qualification uses a derived overall ranking after all group-stage matches are complete.
  Why: this matches the requested behavior without changing how tournaments start or how group matches are played.

- Decision: the overall ranking order is `points DESC`, `point_differential DESC`, `group rank ASC`, then deterministic system coin flip.
  Why: the user selected points then point differential as the primary rule, and group rank provides a simple way to respect finalized in-group tiebreak results before falling back to a deterministic last resort.

- Decision: bracket seeding uses high-vs-low seed lines within each bracket.
  Upper bracket: `1 vs 8`, `4 vs 5`, `2 vs 7`, `3 vs 6`.
  Lower bracket: `9 vs 16`, `12 vs 13`, `10 vs 15`, `11 vs 14`.
  Why: this preserves the current bracket topology while aligning first-round pairings to the new qualification ordering.

- Decision: qualification rank and resulting bracket placement are exposed in tournament payloads and displayed in existing admin and participant tournament pages.
  Why: admins and players need to understand how group-stage results translated into bracket placement.

## Risks / Trade-offs
- Cross-group ranking may feel less intuitive than the current top-2-per-group qualification model, especially when a third-place player from one group outranks a second-place player from another group.
- Deterministic fallback rules must be visible enough in product copy or admin expectations to avoid disputes when points and point differential are equal.
- Reusing the current standings model keeps scope small, but it means qualification rank is derived behavior that must stay consistent across seeding, payloads, and tests.

## Migration Plan
1. Update the ranking and seeding services to derive qualification order from completed group standings.
2. Update tournament payloads and views to show qualification results.
3. Update and expand feature coverage for the new seeding behavior.

No data migration is planned because the proposal assumes qualification order can be derived from existing `group_standings` values.

## Open Questions
- None for this proposal. The requested format, primary ranking rule, and bracket split are defined.
