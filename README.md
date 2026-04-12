# JR Sports

JR Sports is a Laravel 12 + Inertia.js (React) MVP for publishing internal sports events, letting authenticated users register once per event, and giving admins a simple event management flow.

## Stack

- Laravel 12
- Inertia.js with React
- Tailwind CSS
- MySQL for app data
- Docker Compose for local and VPS deployment

## Core Features

- Public upcoming event listing with venue details and Google Maps links
- Authentication for registered users
- Role-based admin access for event management
- Duplicate-safe event registration flow
- Manual registration closing for admins

## Local Development

### App services

- App: `http://localhost:8080`
- Vite: `http://localhost:5173`
- MySQL: `localhost:3307`

### Start with Docker

```bash
docker compose up --build
```

The app container installs Composer dependencies on first boot when the mounted `vendor/` volume is empty, copies `.env.example` to `.env` if needed, and runs migrations when `RUN_MIGRATIONS=true`.

## Production-Style VPS Deployment

Build and run the production compose stack:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Set production environment variables such as `APP_KEY`, `APP_URL`, and the database credentials before starting the stack.

## Test Suite

Run the automated tests with:

```bash
php artisan test
```
