# user-masterdata Specification

## Purpose
TBD - created by archiving change add-user-masterdata. Update Purpose after archive.
## Requirements
### Requirement: Admin User Directory
The system SHALL provide an admin-only user master-data screen that lists active users with their name, email, division, and admin role.

#### Scenario: Admin views the user master-data list
- **WHEN** an authenticated admin opens the user master-data screen
- **THEN** the system shows active users with their `name`, `email`, `division`, and whether they have admin access

#### Scenario: Non-admin user attempts to open user master data
- **WHEN** an authenticated non-admin user requests the admin user master-data screen
- **THEN** the system denies access

### Requirement: Admin User Maintenance
The system SHALL allow admins to create and update user records with `name`, `email`, `division`, and `is_admin`, and SHALL require the admin to set an initial password when creating a user.

#### Scenario: Admin creates a user
- **WHEN** an admin submits a valid new user with `name`, `email`, `division`, `is_admin`, and an initial password
- **THEN** the system stores the user and makes that user visible on the active user master-data list

#### Scenario: Admin updates a user
- **WHEN** an admin submits valid changes to an existing user's `name`, `email`, `division`, or `is_admin` value
- **THEN** the system saves the changes and shows the updated values on the user master-data list

### Requirement: User Division Maintenance
The system SHALL allow an authenticated user to add or update their own `division` from profile settings after self-registration.

#### Scenario: Self-registered user adds a division later
- **WHEN** an authenticated user updates profile settings with a `division` value
- **THEN** the system stores the new `division` on that user record

### Requirement: Archived User Preservation
The system SHALL archive deleted users with soft deletes instead of hard deletes so that registrations and tournament history remain intact.

#### Scenario: Admin archives a user with event history
- **WHEN** an admin deletes a user who has registrations or tournament history
- **THEN** the system soft-deletes the user, removes that user from the active master-data list, and keeps the related historical records intact

#### Scenario: Archived user attempts to authenticate
- **WHEN** a soft-deleted user attempts to sign in
- **THEN** the system does not authenticate that user

