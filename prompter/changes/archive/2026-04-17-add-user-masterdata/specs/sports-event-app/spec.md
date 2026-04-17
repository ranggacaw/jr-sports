## MODIFIED Requirements
### Requirement: Role-Based Access
The system SHALL support public visitor, registered user, and admin access levels with permissions appropriate to browsing, registering, managing events, and managing user master data.

#### Scenario: Public visitor attempts admin action
- **WHEN** a public visitor tries to access an admin-only event management action
- **THEN** the system denies access

#### Scenario: Registered user accesses registration action
- **WHEN** an authenticated non-admin user views an event with open registration
- **THEN** the system allows that user to join the participant list without admin permissions

#### Scenario: Admin accesses user master data
- **WHEN** an authenticated admin requests the user master-data screen
- **THEN** the system allows access to user management features

#### Scenario: Registered user attempts user master data action
- **WHEN** an authenticated non-admin user requests an admin-only user master-data action
- **THEN** the system denies access
