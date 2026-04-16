# Badminton Tournament Management System - Technical Specification

## Objective
Develop a complete badminton tournament management system that handles 16-player events with group stage qualification, dual-bracket elimination (upper/lower), match result calculations, and role-based access control.

## System Requirements

### Tournament Structure
1. **Player Registration**: Support exactly 16 registered users per badminton event
2. **Group Stage Scoring**: Implement a point-based system where:
   - Winner receives 3 points per match
   - Loser receives 0 points per match
   - Track cumulative points for all 16 players throughout the group stage

3. **Bracket Allocation After Group Stage**:
   - Top 8 players (by points) → Upper Bracket
   - Bottom 8 players (by points) → Lower Bracket
   - Handle tiebreaker scenarios (specify your tiebreaker rules: head-to-head, set difference, etc.)

4. **Double Elimination Logic**:
   - Upper Bracket losers drop to Lower Bracket (at appropriate positions)
   - Lower Bracket losers are eliminated completely
   - Upper Bracket winner proceeds directly to Grand Final
   - Lower Bracket winner proceeds to Grand Final
   - Define Grand Final format (single match or best-of series, bracket reset rules if applicable)

### Core Features to Implement

**Match Calculation Module**:
- Create match result entry interface (accessible only to admin roles)
- Calculate and update player points automatically
- Determine bracket placements after group stage completion
- Track bracket progression and player elimination status
- Generate matchups for each round based on seeding/bracket positions

**User Role Management**:
- **Admin/Admin Role Capabilities**:
  - Enter match results and scores
  - Calculate points and update standings
  - Advance players through brackets
  - View all tournament data and statistics
  - Edit/delete/manage event settings

- **Registered User (Player) Capabilities**:
  - View their own match schedule
  - See match details (opponent, time, location if applicable)
  - View match results after admin calculation
  - Access tournament bracket visualization
  - **Cannot**: Enter scores, modify calculations, or access admin functions

**Data to Track Per Match**:
- Match ID and round identifier
- Player 1 and Player 2 (user IDs)
- Match score/result
- Points awarded
- Bracket type (Upper/Lower)
- Match status (scheduled, completed, calculated)
- Timestamp of result entry

**Database Schema Requirements**:
- Events table (tournament metadata)
- Players table (links users to events)
- Matches table (individual match records)
- Brackets table (upper/lower bracket structure)
- Group standings table (point accumulation during group stage)

### Calculations and Logic

**Group Stage**:
- Determine number of group stage matches (round-robin among all 16? Or other format - specify your approach)
- Accumulate points per win (3 points)
- Rank players 1-16 by total points
- Split into brackets: positions 1-8 (upper), positions 9-16 (lower)

**Bracket Progression**:
- Upper Bracket: Standard single-elimination tree (8→4→2→1)
- Lower Bracket: Receive upper bracket losers at designated points + continue elimination
- Map which upper bracket round losers drop to which lower bracket positions
- Track player path through brackets (bracket history)

**Admin Calculation Workflow**:
1. Admin selects completed match
2. Enters final score/winner
3. System calculates points (if group stage) or advancement (if bracket stage)
4. System updates standings/bracket positions automatically
5. System generates next round matchups when round completes

### User Interface Components

**Admin Dashboard**:
- List of all pending matches requiring result entry
- Standings table (sortable by points, with bracket allocation indicators)
- Bracket visualization (upper and lower side-by-side)
- Match result entry form
- Event management controls

**Player View**:
- Personal match schedule (upcoming and completed)
- Match details card (opponent name, date/time, result if calculated)
- Tournament bracket view (read-only, showing their position)
- Current standing/rank display
- No access to calculation or admin functions

### Output Deliverables

Provide implementation code/specifications for:
1. Database schema (tables, fields, relationships, indexes)
2. Match calculation logic (functions/methods for point calculation and bracket progression)
3. User authentication and role-based access control
4. Admin interface for match result entry
5. Player interface for viewing match details
6. Bracket generation algorithm (seeding, matchup creation)
7. API endpoints or functions for:
   - Creating events
   - Registering players
   - Entering match results
   - Retrieving standings
   - Fetching bracket data

### Constraints and Edge Cases

- Validate exactly 16 players per event before allowing tournament start
- Prevent duplicate match result entries
- Handle concurrent admin access (locking mechanisms if needed)
- Define behavior for player withdrawals/disqualifications
- Specify tiebreaker rules for equal points in group stage
- Define Grand Final bracket reset rules (if lower bracket winner wins first match)

### Success Criteria

- System correctly allocates all 16 players to upper/lower brackets based on group points
- Upper bracket losers correctly transfer to lower bracket
- Lower bracket losers are properly eliminated
- Only admin roles can calculate/enter results
- Players can view all their match information without calculation access
- Final match correctly identifies tournament winner

Implement this system ensuring clear separation between admin calculation responsibilities and player view-only access.