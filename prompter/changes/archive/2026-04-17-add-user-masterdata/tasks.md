## 1. Backend foundations
- [x] 1.1 Add `division` and `deleted_at` to the `users` table, then update the `User` model and related validation rules to support the new fields and soft-delete behavior.
- [x] 1.2 Add admin-only routes, requests, and controller actions for listing, creating, updating, and archiving users.
- [x] 1.3 Extend the authenticated profile update flow so existing users can add or change their own `division` after self-registration.

## 2. Admin interface
- [x] 2.1 Add a user master-data screen in the admin area that shows active users with `name`, `email`, `division`, and admin role details.
- [x] 2.2 Add admin create/edit forms that support `name`, `email`, `division`, `is_admin`, initial password on create, and archive actions.

## 3. Validation
- [x] 3.1 Add feature coverage for admin-only access to user master data and for the create, update, and archive flows.
- [x] 3.2 Add feature coverage for preserved event history after archiving a user and for user profile division updates.
- [x] 3.3 Run `php artisan test` and `npm run build`.

## Notes
- Tasks `2.1` and `2.2` depend on `1.2`.
- Tasks `3.1` and `3.2` can be developed in parallel with the backend and frontend work, but they must pass after `2.2` is complete.
