# Tournament Design Document

This document outlines the architectural and design decisions for adding the 16-Player Badminton Tournament capability to JR Sports.

## Domain Model Additions
To support the tournament without leaking complexity into the existing `SportsEvent` and `Registration` models, the following entities will be introduced:

-   `Tournament`: A 1-to-1 extension of `SportsEvent`. Tracks the overall state (e.g., `pending`, `group_stage`, `bracket_stage`, `completed`).
-   `Match`: Represents a single game between two `Registration` participants. Tracks `stage` (group vs. bracket), `status` (scheduled, completed), and `scores`.
-   `GroupStanding`: A specialized table or pivot to cache players' points, sets won, sets lost, and calculated rank within their respective groups (A, B, C, D).

## Architecture Patterns

### State Machine for Tournament Lifecycle
The tournament will progress through a strict, one-way state machine:
1.  `Pending`: Awaiting 16 registrations.
2.  `Group Stage`: Round-robin matches are generated.
3.  `Bracket Stage`: Upper and lower brackets are generated based on group standings.
4.  `Completed`: Grand final is resolved.

This prevents out-of-order execution, such as generating brackets before all group stage matches are completed.

### Idempotent Result Processing
When an admin submits a match result, the backend will use an Observer or sequential Action class to:
1.  Save the match scores.
2.  Recalculate `GroupStanding` (if in the group stage) or progress the winner/loser to the next `Match` (if in the bracket stage).
3.  Check if the current stage is complete and auto-advance the tournament state if applicable.
*All these steps will be wrapped in a database transaction to ensure data integrity.*

### Bracket Representation (Frontend React)
The bracket UI will be a read-only React component that consumes a deeply nested JSON structure representing the matches. Since the tournament format is strictly fixed to 16 players, we will use hard-coded layout trees rather than a fully dynamic DAG (Directed Acyclic Graph) renderer. This greatly simplifies the UI complexity while guaranteeing correct layout.

## Data Consistency Rules
-   A match cannot be scored if either participant is "TBD".
-   A player dropping down from the Upper Bracket must strictly be placed into the corresponding Lower Bracket round as defined by standard double-elimination topology.
-   No group-stage matches can be altered once the tournament state transitions to `bracket_stage`.
