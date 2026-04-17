# badminton-tournament Specification

## Purpose
Define the fixed 16-player badminton tournament lifecycle, standings rules, bracket progression, and participant visibility for JR Sports events.
## Requirements
### Requirement: Tournament Initialization Constraints
The system SHALL strictly restrict the initiation of a badminton tournament to events that have exactly 16 confirmed registered players.

#### Scenario: Admin attempts to start tournament with less than 16 players
- **WHEN** an admin clicks "Start Tournament" on an event with 15 or fewer registered players
- **THEN** the system prevents the action and displays an error indicating exactly 16 players are required.

#### Scenario: Admin successfully starts a 16-player tournament
- **WHEN** an admin clicks "Start Tournament" on an event with exactly 16 registered players
- **THEN** the system generates the Group Stage matches and transitions the event state to "Group Stage".

### Requirement: Group Stage Execution
The system SHALL organize the 16 players into 4 groups of 4 players each, where matches yield 3 points for a win and 0 points for a loss.

#### Scenario: Admin records a group stage match result
- **WHEN** an admin submits a completed group stage match score
- **THEN** the winner is awarded 3 points, the loser receives 0 points, and the group standings are automatically updated.

### Requirement: Group Standing Tiebreakers
The system SHALL resolve ties in the group stage using a defined hierarchy: Points > Point Differential > Head-to-Head > System Coin Flip.

#### Scenario: Two players finish the group stage with equal points
- **WHEN** group stage standings are finalized and two players possess the same total points
- **THEN** the system ranks the player with the higher point differential above the other.

### Requirement: Double Elimination Bracket Generation
The system SHALL automatically seed players ranked 1 through 8 in the overall qualification ranking into the Upper Bracket and players ranked 9 through 16 into the Lower Bracket upon group stage completion.

#### Scenario: Group stage concludes and brackets are generated from overall qualification ranks
- **WHEN** the final group stage match is recorded
- **THEN** the system immediately populates the Upper Bracket as `1 vs 8`, `4 vs 5`, `2 vs 7`, and `3 vs 6`, and the Lower Bracket as `9 vs 16`, `12 vs 13`, `10 vs 15`, and `11 vs 14`.

### Requirement: Bracket Progression Flow
The system SHALL advance winners in both brackets, drop Upper Bracket losers into the Lower Bracket, and eliminate Lower Bracket losers.

#### Scenario: A player loses in the Upper Bracket
- **WHEN** an admin records a match loss for an Upper Bracket participant
- **THEN** that participant is automatically scheduled into their corresponding next available slot in the Lower Bracket.

#### Scenario: A player loses in the Lower Bracket
- **WHEN** an admin records a match loss for a Lower Bracket participant
- **THEN** that participant is eliminated from the tournament.

### Requirement: Read-Only Player Views
The system SHALL provide participating players with read-only visibility into the tournament schedule, individual match history, current group standings, overall qualification rank after group-stage completion, resulting bracket placement, and the overall bracket structure.

#### Scenario: A player views the tournament page after qualification is complete
- **WHEN** an authenticated player navigates to the active tournament dashboard after the group stage has finished
- **THEN** they see their group standings, their qualification rank, the bracket they entered, and the tournament brackets without any ability to edit results.

### Requirement: Overall Qualification Ranking
The system SHALL calculate a single overall qualification ranking for all 16 players after the group stage is complete by ordering players by points in descending order, point differential in descending order, finalized group rank in ascending order, and deterministic system coin flip for any remaining tie.

#### Scenario: Group stage completes and qualification ranks are finalized
- **WHEN** the final scheduled group-stage match is recorded
- **THEN** the system assigns unique qualification ranks 1 through 16 across all players using the defined overall ranking order.

