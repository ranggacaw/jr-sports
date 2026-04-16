# Change: Operate a Complete 16-Player Badminton Tournament

**Epic Reference**: `prompter/operate-a-complete-16-player-badminton-tournament/epic.md`

## Why
JR Sports currently supports event creation and player registration but lacks built-in tournament management. For a 16-player badminton event, event admins currently have to manually track matches, group stages, tiebreakers, and double-elimination brackets, which is error-prone and lacks transparency for players.

## What Changes
- Add a complete lifecycle management system for a fixed 16-player badminton tournament.
- Add group stage execution, standings tiebreakers, and automatic upper/lower bracket seeding.
- Add admin result-management workflows and read-only player tournament visibility.

## Impact
- Affected specs: `badminton-tournament`
- Affected code: tournament models, tournament services, admin scoring flows, authenticated event details UI
