## ADDED Requirements
### Requirement: Entrant Composition by Format
The system SHALL build badminton tournaments from confirmed event registrations using entrant rules tied to the configured format. In `singles`, each active entrant SHALL contain exactly one unique confirmed registration. In `doubles`, each active entrant SHALL contain a team name and exactly two unique confirmed registrations. A confirmed registration SHALL NOT be assigned to more than one active entrant.

#### Scenario: Admin creates a valid doubles entrant
- **WHEN** an admin configures a doubles tournament and creates a team with a team name plus two unique confirmed event registrations
- **THEN** the system accepts the entrant as part of the active tournament roster.

#### Scenario: Admin assigns the same player twice in doubles setup
- **WHEN** an admin tries to reuse the same confirmed registration in two active doubles teams or twice within one team
- **THEN** the system rejects the configuration and explains that each active entrant must use unique players.

### Requirement: Reserve Player Management
The system SHALL allow admins to assign optional reserve users from confirmed event registrations during tournament setup. Reserve users SHALL NOT count toward the configured active entrant count and SHALL NOT appear in scheduled matches, standings, qualification rankings, or brackets unless they are manually promoted before tournament start.

#### Scenario: Admin adds reserve users during tournament setup
- **WHEN** an admin completes the active tournament roster and marks additional confirmed registrations as reserves before starting the tournament
- **THEN** the system stores those reserves separately from the active entrants.

#### Scenario: Tournament starts with reserve users present
- **WHEN** the admin starts a tournament that includes reserve users
- **THEN** the system schedules only the configured active entrants and leaves reserve users out of the active draw.

## MODIFIED Requirements
### Requirement: Tournament Initialization Constraints
The system SHALL allow an admin to configure a badminton tournament before start by selecting a tournament format of `singles` or `doubles` and a supported active entrant count of `4`, `8`, or `16`. The system SHALL only start the tournament when the active roster exactly matches the configured entrant count and every entrant is fully defined from confirmed event registrations.

#### Scenario: Admin attempts to start a singles tournament with too few active entrants
- **WHEN** an admin configures a singles tournament for `8` active entrants but selects only `7` confirmed registrations
- **THEN** the system prevents the tournament from starting and explains that exactly `8` active entrants are required.

#### Scenario: Admin starts a doubles tournament with a complete active roster
- **WHEN** an admin configures a doubles tournament for `4` active entrants and defines `4` named teams with exactly two confirmed registrations each
- **THEN** the system starts the tournament and stores the configured format and entrant count.

### Requirement: Group Stage Execution
The system SHALL organize active entrants into groups of four based on the configured entrant count, producing one group for `4` entrants, two groups for `8` entrants, and four groups for `16` entrants. Each group-stage match SHALL award `3` points for a win and `0` points for a loss.

#### Scenario: Admin records a doubles group-stage match result in an eight-entrant tournament
- **WHEN** an admin submits a completed group-stage match score for one doubles team against another in a tournament configured for `8` active entrants
- **THEN** the winning entrant receives `3` points, the losing entrant receives `0` points, and the relevant group standings are updated automatically.

### Requirement: Group Standing Tiebreakers
The system SHALL resolve group-stage ties between entrants using the hierarchy `Points > Point Differential > Head-to-Head > System Coin Flip`, regardless of whether the tournament format is singles or doubles.

#### Scenario: Two doubles teams finish the group stage with equal points
- **WHEN** group-stage standings are finalized and two doubles entrants have the same total points
- **THEN** the system ranks the entrant with the higher point differential above the other before considering later tiebreakers.

### Requirement: Double Elimination Bracket Generation
The system SHALL automatically seed the configured active entrant field into upper and lower brackets after group-stage completion by placing the top half of qualification ranks into the Upper Bracket and the bottom half into the Lower Bracket. For supported entrant counts, the first-round pairings SHALL be `1 vs 2` and `3 vs 4` for a `4`-entrant field, `1 vs 4` and `2 vs 3` in the Upper Bracket plus `5 vs 8` and `6 vs 7` in the Lower Bracket for an `8`-entrant field, and `1 vs 8`, `4 vs 5`, `2 vs 7`, `3 vs 6` in the Upper Bracket plus `9 vs 16`, `12 vs 13`, `10 vs 15`, and `11 vs 14` in the Lower Bracket for a `16`-entrant field.

#### Scenario: Group stage concludes for an eight-entrant tournament
- **WHEN** the final scheduled group-stage match is recorded in a tournament configured for `8` active entrants
- **THEN** the system assigns qualification ranks `1` through `8`, places ranks `1` through `4` into the Upper Bracket, and places ranks `5` through `8` into the Lower Bracket using the defined first-round pairings.

### Requirement: Bracket Progression Flow
The system SHALL advance winners in both brackets, drop Upper Bracket losers into the Lower Bracket, and eliminate Lower Bracket losers for all supported entrant counts in both singles and doubles tournaments.

#### Scenario: A doubles team loses in the Upper Bracket
- **WHEN** an admin records a match loss for a doubles entrant in the Upper Bracket
- **THEN** that entrant is automatically scheduled into the corresponding next available slot in the Lower Bracket.

#### Scenario: A singles entrant loses in the Lower Bracket
- **WHEN** an admin records a match loss for a singles entrant in the Lower Bracket
- **THEN** that entrant is eliminated from the tournament.

### Requirement: Read-Only Player Views
The system SHALL provide participating users with read-only visibility into the tournament schedule, entrant match history, current group standings, qualification rank after group-stage completion, resulting bracket placement, and the overall bracket structure. For doubles tournaments, the system SHALL display each team's name and both active players, and SHALL list reserve users separately from active entrants.

#### Scenario: A player views a doubles tournament page after qualification is complete
- **WHEN** an authenticated user assigned to an active doubles team navigates to the tournament dashboard after the group stage has finished
- **THEN** the user sees their team name, both team members, their qualification rank, the bracket they entered, the tournament brackets, and any reserve list without any ability to edit results.

### Requirement: Overall Qualification Ranking
The system SHALL calculate a single overall qualification ranking for all active entrants after the group stage is complete by ordering entrants by points in descending order, point differential in descending order, finalized group rank in ascending order, and deterministic system coin flip for any remaining tie. The system SHALL assign unique qualification ranks `1` through the configured active entrant count.

#### Scenario: An eight-entrant tournament completes the group stage
- **WHEN** the final scheduled group-stage match is recorded for a tournament configured for `8` active entrants
- **THEN** the system assigns unique qualification ranks `1` through `8` across all active entrants using the defined overall ranking order.
