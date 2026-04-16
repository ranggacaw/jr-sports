## ADDED Requirements
### Requirement: Overall Qualification Ranking
The system SHALL calculate a single overall qualification ranking for all 16 players after the group stage is complete by ordering players by points in descending order, point differential in descending order, finalized group rank in ascending order, and deterministic system coin flip for any remaining tie.

#### Scenario: Group stage completes and qualification ranks are finalized
- **WHEN** the final scheduled group-stage match is recorded
- **THEN** the system assigns unique qualification ranks 1 through 16 across all players using the defined overall ranking order.

## MODIFIED Requirements
### Requirement: Double Elimination Bracket Generation
The system SHALL automatically seed players ranked 1 through 8 in the overall qualification ranking into the Upper Bracket and players ranked 9 through 16 into the Lower Bracket upon group stage completion.

#### Scenario: Group stage concludes and brackets are generated from overall qualification ranks
- **WHEN** the final group stage match is recorded
- **THEN** the system immediately populates the Upper Bracket as `1 vs 8`, `4 vs 5`, `2 vs 7`, and `3 vs 6`, and the Lower Bracket as `9 vs 16`, `12 vs 13`, `10 vs 15`, and `11 vs 14`.

### Requirement: Read-Only Player Views
The system SHALL provide participating players with read-only visibility into the tournament schedule, individual match history, current group standings, overall qualification rank after group-stage completion, resulting bracket placement, and the overall bracket structure.

#### Scenario: A player views the tournament page after qualification is complete
- **WHEN** an authenticated player navigates to the active tournament dashboard after the group stage has finished
- **THEN** they see their group standings, their qualification rank, the bracket they entered, and the tournament brackets without any ability to edit results.
