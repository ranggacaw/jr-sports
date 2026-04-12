## ADDED Requirements

### Requirement: Public Event Listing
The system SHALL present a public list of upcoming sports events that includes the event name, schedule, venue details, registration status, and a clickable Google Maps link when provided.

#### Scenario: Visitor views upcoming events
- **WHEN** a public visitor opens the event listing page
- **THEN** the system shows upcoming sports events with their schedule, venue, registration status, and clickable Google Maps link

### Requirement: Authenticated Event Registration
The system SHALL allow an authenticated user to join an open sports event participant list exactly once until an admin closes registration.

#### Scenario: User joins an open event
- **WHEN** an authenticated user submits registration for an event whose registration is open and the user is not already registered
- **THEN** the system records the registration and shows the user on the participant list

#### Scenario: User attempts to join a closed event
- **WHEN** an authenticated user submits registration for an event whose registration has been closed
- **THEN** the system rejects the registration and informs the user that sign-up is closed

### Requirement: Administrative Event Management
The system SHALL allow admins to create and update sports events with recurrence details, schedule, venue information, and a Google Maps link, and to close registration when sign-up should stop.

#### Scenario: Admin creates an event
- **WHEN** an admin submits a valid new sports event with its schedule, venue, and optional Google Maps link
- **THEN** the system stores the event and makes it available on the event listing page

#### Scenario: Admin closes registration
- **WHEN** an admin closes registration for an existing sports event
- **THEN** the system prevents any new user registrations for that event

### Requirement: Role-Based Access
The system SHALL support public visitor, registered user, and admin access levels with permissions appropriate to browsing, registering, and managing events.

#### Scenario: Public visitor attempts admin action
- **WHEN** a public visitor tries to access an admin-only event management action
- **THEN** the system denies access

#### Scenario: Registered user accesses registration action
- **WHEN** an authenticated non-admin user views an event with open registration
- **THEN** the system allows that user to join the participant list without admin permissions
