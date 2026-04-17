## Context
The current application has no admin-facing user management. Users are created through the public registration flow, admins are represented by the existing `is_admin` boolean, and user deletion currently removes the row entirely. Registrations reference `users.id` with cascade delete, so hard-deleting a user would also remove event participation history that admins may still need to keep.

## Goals / Non-Goals
- Goals:
- Provide an admin-only master-data screen for users.
- Store `division` on user records for internal company use.
- Allow admins to create users by setting an initial password directly.
- Preserve registration and tournament history when an admin removes a user from active master data.
- Let self-registered users backfill `division` from profile settings without changing the existing registration form.
- Non-Goals:
- Introduce invitation flows, email onboarding, or password-reset-driven provisioning.
- Replace `is_admin` with a broader roles and permissions system.
- Add bulk import/export, archived-user restore UI, or organizational hierarchy beyond `division`.

## Decisions
- Decision: Add a nullable `division` column to `users`.
- Alternatives considered: Creating a separate divisions table was rejected for this change because the request only needs a single company-specific text attribute and there is no existing reference data model for divisions.

- Decision: Keep self-registration limited to the current fields and let users add `division` later in profile settings.
- Alternatives considered: Requiring `division` during self-registration was rejected because the requested behavior explicitly allows self-registered users to complete that field later.

- Decision: Add a dedicated admin user management surface under the existing admin area and keep authorization tied to `is_admin`.
- Alternatives considered: Exposing user management from profile screens or adding a new permission system was rejected because it expands scope beyond the requested master-data feature.

- Decision: Archive users with soft deletes instead of hard deletes.
- Alternatives considered: Blocking deletion entirely was rejected because admins asked for delete behavior, and hard delete was rejected because current registration foreign keys cascade and would erase historical participation data.

- Decision: Keep email uniqueness across all users, including archived rows, unless implementation uncovers a concrete business need to reuse archived addresses.
- Alternatives considered: Reworking email uniqueness to ignore archived users was rejected for this proposal because it adds migration and identity edge cases that are not required by the current request.

## Risks / Trade-offs
- Soft deletes preserve history, but archived rows still count as historical identities and may prevent reusing the same email address later.
- Adding `division` only in admin create/edit and profile edit means some older self-registered accounts may remain incomplete until users update their profiles.
- Admin-created passwords are straightforward, but they place the responsibility for secure initial credential handoff on the admin workflow.

## Migration Plan
1. Add `division` and `deleted_at` to `users`.
2. Update the `User` model, validation, and auth-related flows to respect archived users.
3. Add admin routes, controller actions, and Inertia pages for user list/create/edit/archive.
4. Extend profile editing to persist `division` for self-registered users.
5. Cover the new behavior with feature tests and run the required test/build commands.

## Open Questions
- None.
