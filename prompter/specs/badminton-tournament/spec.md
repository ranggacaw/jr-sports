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
The system SHALL automatically seed the top 8 group-stage players into an Upper Bracket and the bottom 8 into a Lower Bracket upon group stage completion.

#### Scenario: Group stage concludes and brackets are requested
- **WHEN** the final group stage match is recorded
- **THEN** the system immediately populates the first round of the Upper Bracket with the top 2 players from each group, and the Lower Bracket with the bottom 2 players from each group.

### Requirement: Bracket Progression Flow
The system SHALL advance winners in both brackets, drop Upper Bracket losers into the Lower Bracket, and eliminate Lower Bracket losers.

#### Scenario: A player loses in the Upper Bracket
- **WHEN** an admin records a match loss for an Upper Bracket participant
- **THEN** that participant is automatically scheduled into their corresponding next available slot in the Lower Bracket.

#### Scenario: A player loses in the Lower Bracket
- **WHEN** an admin records a match loss for a Lower Bracket participant
- **THEN** that participant is eliminated from the tournament.

### Requirement: Read-Only Player Views
The system SHALL provide participating players with read-only visibility into the tournament's schedule, their individual match history, current standings, and the overall bracket structure.

#### Scenario: A player views the tournament page
- **WHEN** an authenticated player navigates to the active tournament dashboard
- **THEN** they see the current group standings and brackets but cannot edit any match results.
