# Change: Add user master data

## Why
The application currently creates users through self-registration and only stores `name`, `email`, `is_admin`, and `password`. Admins do not have a central user master-data screen, and the system does not capture the internal-company `division` value that the team needs for user records.

## What Changes
- Add an admin-only user master-data capability for listing, creating, updating, and archiving users.
- Add a `division` attribute to user records and manage it from admin user forms.
- Allow admins to set the initial password when creating a user.
- Extend profile settings so self-registered users can add or update their own `division` later.
- Preserve event registrations and tournament history by archiving users with soft deletes instead of hard deletes.

## Impact
- Affected specs: `sports-event-app`, `user-masterdata`
- Affected code: `app/Models/User.php`, `app/Http/Controllers/Auth/RegisteredUserController.php`, `app/Http/Controllers/ProfileController.php`, `app/Http/Requests/ProfileUpdateRequest.php`, `routes/web.php`, new admin user controller/request/page files, `database/migrations/*users*`, user-related feature tests
