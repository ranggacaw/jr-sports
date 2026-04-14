## ADDED Requirements

### Requirement: Authenticated Event Details
The system SHALL provide an authenticated event details page for a single upcoming sports event that includes the schedule, venue details, registration status, and the current participant list.

#### Scenario: Authenticated user views event details
- **WHEN** an authenticated user opens the details page for an upcoming sports event
- **THEN** the system shows the event schedule, venue details, registration status, and the users currently on the participant list

#### Scenario: Guest attempts to view event details
- **WHEN** a public visitor opens the details page for a sports event
- **THEN** the system requires authentication before showing the participant list
