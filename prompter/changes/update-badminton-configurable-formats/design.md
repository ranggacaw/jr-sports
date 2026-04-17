## Context
The current JR Sports badminton capability assumes that every tournament is a singles tournament with exactly 16 active registrations. The requested adjustment adds two new setup concerns before a tournament starts: the admin must choose whether the tournament is singles or doubles, and the active tournament size must be configurable instead of fixed at 16. The same change also introduces optional reserve users and a need to present team-based labels in admin and participant views.

## Goals / Non-Goals
- Goals:
- Support badminton tournaments with active entrant counts of 4, 8, or 16.
- Support both singles entrants and doubles teams from the same pool of confirmed event registrations.
- Keep reserve users visible but outside the scheduled tournament draw.
- Preserve the current read-only participant experience for non-admin users.
- Non-Goals:
- Arbitrary entrant counts outside 4, 8, or 16.
- Mid-tournament substitutions or automatic reserve promotion.
- Replacing the existing sports-event registration workflow with team-based public registration.

## Decisions
- Decision: Keep `registrations` as the source roster and layer tournament-specific entrant configuration on top of it.
- Alternatives considered: Replacing event registration with a tournament-only roster model was rejected because it would expand scope into the public event flow and duplicate existing participant records.

- Decision: Support `4`, `8`, and `16` active entrants in the first version.
- Alternatives considered: Allowing any positive entrant count was rejected because the current tournament engine is group-based and bracket-based; limiting the first version to group-compatible powers of two keeps the change implementable and testable.

- Decision: Represent doubles entrants as named teams with exactly two unique confirmed registrations, and represent reserve users separately from active entrants.
- Alternatives considered: Treating doubles as pairs without team names was rejected because the request explicitly requires a team name and clearer doubles display.

- Decision: Generalize the current lifecycle around the concept of an "entrant" rather than assuming one entrant always equals one player.
- Alternatives considered: Maintaining separate singles-only and doubles-only tournament engines was rejected because most standings, seeding, and bracket logic can share the same entrant-oriented flow.

## Risks / Trade-offs
- Data model expansion across tournaments, standings, and match payloads increases migration and serialization complexity.
  Mitigation: keep event registration unchanged and add tournament-specific metadata only where the active draw needs it.

- Variable-size seeding can introduce regressions in the current 16-entrant path.
  Mitigation: retain the existing 16-entrant pairing pattern as the reference case and add explicit tests for 4-, 8-, and 16-entrant tournaments.

- Reserve handling can be confused with active entrants if the UI does not separate them clearly.
  Mitigation: show reserves as a distinct roster section and exclude them from standings, match scheduling, and brackets by rule.

## Migration Plan
1. Add tournament configuration fields and entrant metadata structures.
2. Update admin setup so tournaments are configured before start instead of inferred from raw participant count only.
3. Refactor initialization, standings, and bracket logic to operate on active entrants.
4. Update admin and participant tournament payloads and screens.
5. Backfill or default existing tournaments to `singles` with an entrant count of `16` so the current path remains valid.

## Open Questions
- None for proposal scope. Current assumptions are: configurable entrant counts are limited to `4`, `8`, and `16`; doubles counts active teams, not individual users; optional additional users are reserves and do not enter the active draw.
