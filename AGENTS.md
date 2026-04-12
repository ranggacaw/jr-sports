<!-- PROMPTER:START -->
# Prompter Instructions

These instructions are for AI assistants working in this project.

Always open `@/prompter/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/prompter/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines
- Show Remaining Tasks

<!-- PROMPTER:END -->

# Project Summary

JR Sports is an internal sports-event MVP built with Laravel 12 and Inertia.js. Public visitors can browse upcoming events, authenticated users can register once per event, and admins can create events and close registration.

# Tech Stack

- PHP 8.2
- Laravel 12
- Inertia.js with React
- Tailwind CSS
- MySQL for app data
- PHPUnit for automated tests
- Docker Compose for local and VPS-style deployment

# Commands

- `composer install`
- `npm install`
- `php artisan migrate --seed`
- `php artisan test`
- `npm run build`
- `npm run dev`
- `docker compose up --build`
- `docker compose -f docker-compose.prod.yml up --build -d`

# Folder Structure

- `app/Http/Controllers/` HTTP controllers for public, auth, and admin flows
- `app/Models/` Eloquent models for users, venues, sports events, and registrations
- `database/migrations/` schema for auth tables plus sports event domain tables
- `database/factories/` factories used by feature tests
- `resources/js/Pages/` Inertia React pages
- `resources/js/Layouts/` shared authenticated and guest layouts
- `tests/Feature/` feature coverage for auth, listing, registration, and admin access
- `docker/` container entrypoint and PHP config

# Coding Conventions

- Keep controllers thin and validation close to the write path unless reuse becomes obvious.
- Use `SportsEvent`, `Venue`, and `Registration` as the canonical domain model names.
- Use `registration_closed_at` as the source of truth for whether sign-up is open.
- Keep React pages simple and page-focused; only extract shared components when at least two screens genuinely share the same UI.

# Development Rules For AI Agents

## Always Do

- Preserve the managed Prompter block at the top of this file.
- Run `php artisan test` after backend changes.
- Run `npm run build` after frontend changes.
- Keep guest access limited to the public event listing and auth screens.

## Ask First

- Changing the event data model beyond users, venues, sports events, and registrations
- Adding new dependencies or Laravel packages
- Changing auth behavior beyond the current self-registration plus `is_admin` role split

## Never Do

- Commit secrets from `.env`
- Remove the unique registration constraint that prevents duplicate sign-ups
- Bypass the admin middleware for management routes
