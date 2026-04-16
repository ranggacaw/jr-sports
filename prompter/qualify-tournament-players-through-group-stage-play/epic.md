## 🧠 Epic: Qualify Tournament Players Through Group Stage Play

### 🎯 Epic Goal
We need to introduce a group stage before upper and lower bracket qualification in order for event admins and participants to progress into elimination play through a fair, transparent ranking process.

### 🚀 Definition of Done
- A tournament cannot generate upper and lower brackets until all required group-stage matches are completed or otherwise resolved.
- The system defines how players are assigned into groups, how points are awarded, and how standings are ranked before bracket qualification.
- The top-performing players qualify into the upper bracket and the remaining qualified players enter the lower bracket based on finalized group standings.
- Admins can manage group-stage results and see bracket qualification update only when the group stage is complete.
- Players can view their group-stage schedule, standings, qualification outcome, and the bracket they enter.

### 📌 High-Level Scope (Included)
- Group-stage setup rules for tournaments that later split into upper and lower brackets.
- Standings calculation, qualification ranking, and tiebreaker behavior for group-stage play.
- Bracket entry rules that use group-stage results as the gate to upper and lower bracket generation.
- Admin workflows and participant views needed to operate and understand the group-to-bracket progression.

### ❌ Out of Scope
- Support for alternative tournament formats that skip bracket play entirely.
- Live scoring, streaming, or spectator-facing enhancements beyond current tournament visibility.
- Expansion to variable tournament sizes unless separately defined.

### 📁 Deliverables
- Defined tournament workflow covering group-stage completion, qualification rules, and upper/lower bracket entry.
- Admin-facing capability requirements for recording group-stage results and triggering bracket progression.
- Participant-facing requirements for viewing group standings, qualification status, and bracket placement.

### 🧩 Dependencies
- Existing JR Sports event registration, tournament administration, and participant visibility flows.
- Final business decision on group count, qualification split, and tiebreaker priority.
- Confirmation of how incomplete matches, withdrawals, or disqualifications affect qualification.

### ⚠️ Risks / Assumptions
- Assumption: the tournament still uses a fixed bracket structure after qualification and only the entry criteria are changing.
- Risk: unresolved tiebreaker or exception-handling rules can delay delivery or cause disputes in bracket placement.
- Risk: if group-stage completion is blocked by missing results, bracket generation may be delayed for the full event.

### 🎯 Success Metrics
- 100% of completed tournament runs place players into upper or lower brackets according to published group-stage rules.
- Admins can complete qualification without manual bracket calculation or external tracking.
- Players can view accurate group standings and bracket placement throughout tournament progression.

Saved to: `prompter/qualify-tournament-players-through-group-stage-play/epic.md`
