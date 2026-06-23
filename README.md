# Example React — Laravel + React Starter Kit

A modern, production-ready full-stack starter application built with **Laravel 13** and **React 19**, featuring comprehensive authentication, user management, and a polished UI component library.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Available Commands](#available-commands)
- [Project Structure](#project-structure)
- [Deployment Notes](#deployment-notes)

---

## Project Overview

This project is a full-stack web application that combines a Laravel backend with a React frontend connected via [Inertia.js](https://inertiajs.com/). It ships with a complete authentication system powered by [Laravel Fortify](https://laravel.com/docs/fortify), including support for passkeys (WebAuthn) and two-factor authentication (TOTP).

The frontend uses [Radix UI](https://www.radix-ui.com/) primitives styled with [Tailwind CSS v4](https://tailwindcss.com/), providing an accessible and customisable component library out of the box.

---

## Features

- **User Authentication** — Registration, login, logout, and password reset via Laravel Fortify
- **Email Verification** — Enforces email confirmation before accessing protected areas
- **Two-Factor Authentication (2FA)** — TOTP-based 2FA with recovery codes
- **Passkeys (WebAuthn)** — Passwordless authentication using device credentials
- **Profile Management** — Update name, email address, or delete account
- **Security Settings** — Manage password, 2FA, and registered passkeys from a dedicated page
- **Appearance Settings** — User-selectable theme / appearance preferences
- **Server-Side Rendering ready** — Inertia.js SSR build target included
- **Full Type Safety** — Strict TypeScript on the frontend, PHPStan level 7 on the backend
- **CI/CD** — GitHub Actions workflows for linting and testing

---

## Technology Stack

### Backend

| Technology | Version | Purpose |
|---|---|---|
| [PHP](https://www.php.net/) | ^8.3 | Server-side language |
| [Laravel](https://laravel.com/) | ^13.7 | Application framework |
| [Inertia.js (Laravel adapter)](https://inertiajs.com/) | ^3.0 | Bridge between Laravel and React |
| [Laravel Fortify](https://laravel.com/docs/fortify) | ^1.37 | Headless authentication backend |
| [Laravel Chisel](https://github.com/laravel/chisel) | ^0.1 | Code scaffolding |
| [Laravel Wayfinder](https://github.com/laravel/wayfinder) | ^0.1 | Type-safe route/action helpers |
| [Laravel Sail](https://laravel.com/docs/sail) | ^1.53 | Docker development environment |
| [PHPUnit](https://phpunit.de/) | ^12.5 | Testing framework |
| [Larastan](https://github.com/larastan/larastan) | ^3.9 | PHPStan static analysis for Laravel |
| [Laravel Pint](https://laravel.com/docs/pint) | ^1.27 | PHP code style fixer |

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | ^19.2 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | ^5.7 | Type-safe JavaScript |
| [Vite](https://vite.dev/) | ^8.0 | Build tool & dev server |
| [Inertia.js (React adapter)](https://inertiajs.com/) | ^3.0 | SPA-style page navigation |
| [Tailwind CSS](https://tailwindcss.com/) | ^4.0 | Utility-first CSS framework |
| [Radix UI](https://www.radix-ui.com/) | various | Accessible headless UI primitives |
| [Lucide React](https://lucide.dev/) | ^0.475 | Icon library |
| [Sonner](https://sonner.emilkowal.ski/) | ^2.0 | Toast notifications |
| [ESLint](https://eslint.org/) | ^9.19 | JavaScript/TypeScript linter |
| [Prettier](https://prettier.io/) | ^3.4 | Code formatter |

---

## Installation

### Prerequisites

- PHP 8.3 or higher with the following extensions: `pdo`, `mbstring`, `xml`, `curl`, `sqlite3` (for local development)
- [Composer](https://getcomposer.org/) 2.x
- Node.js 22.x and npm

### Quick Start

The project ships with a `setup` Composer script that handles the full initial setup in one command:

```bash
git clone https://github.com/EvhenZhykov/example-react.git
cd example-react
composer run setup
```

The `setup` script performs the following steps automatically:

1. `composer install` — installs PHP dependencies
2. Copies `.env.example` to `.env`
3. `php artisan key:generate` — generates the application encryption key
4. `php artisan migrate` — runs database migrations
5. `npm install` — installs Node.js dependencies
6. `npm run build` — compiles frontend assets

### Manual Installation

If you prefer to run each step individually:

```bash
# 1. Install PHP dependencies
composer install

# 2. Set up environment file
cp .env.example .env
php artisan key:generate

# 3. Run database migrations
php artisan migrate

# 4. Install Node.js dependencies and build assets
npm install
npm run build
```

---

## Environment Setup

Copy `.env.example` to `.env` and adjust the values for your environment:

```bash
cp .env.example .env
```

### Key Environment Variables

| Variable | Default | Description |
|---|---|---|
| `APP_NAME` | `Laravel` | Application name (also exposed to Vite as `VITE_APP_NAME`) |
| `APP_ENV` | `local` | Environment (`local`, `production`, `testing`) |
| `APP_KEY` | — | Encryption key — generated by `php artisan key:generate` |
| `APP_DEBUG` | `true` | Enable debug mode (set to `false` in production) |
| `APP_URL` | `http://localhost` | Base URL of the application |
| `DB_CONNECTION` | `sqlite` | Database driver (`sqlite`, `mysql`, `pgsql`) |
| `SESSION_DRIVER` | `database` | Session storage driver |
| `QUEUE_CONNECTION` | `database` | Queue driver |
| `CACHE_STORE` | `database` | Cache store |
| `MAIL_MAILER` | `log` | Mail transport (use `smtp` or similar in production) |
| `BCRYPT_ROUNDS` | `12` | Bcrypt hashing cost factor |

### Database

By default the application uses **SQLite** for simplicity. To switch to MySQL or PostgreSQL, update the `DB_*` variables:

```dotenv
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=example_react
DB_USERNAME=root
DB_PASSWORD=secret
```

---

## Development Workflow

### Starting the Development Environment

Run all development services concurrently (web server, queue worker, log viewer, and Vite dev server):

```bash
composer run dev
```

This command starts:
- `php artisan serve` — Laravel development server at `http://localhost:8000`
- `php artisan queue:listen` — processes queued jobs
- `php artisan pail` — real-time log viewer
- `npm run dev` — Vite HMR dev server

### Running Tests

```bash
# Run the full test suite (includes linting and type checks)
composer run test

# Run only PHPUnit tests
php artisan test

# Run a specific test file
php artisan test tests/Feature/Auth/AuthenticationTest.php
```

### Code Quality Checks

```bash
# Check PHP style (Pint) and frontend (ESLint + Prettier + TypeScript)
composer run ci:check

# Auto-fix PHP code style
composer run lint

# Auto-fix frontend code style
npm run format && npm run lint
```

---

## Available Commands

### Composer Scripts

| Command | Description |
|---|---|
| `composer run setup` | Full first-time project setup |
| `composer run dev` | Start all development services |
| `composer run lint` | Auto-fix PHP code style with Pint |
| `composer run lint:check` | Check PHP code style without modifying files |
| `composer run types:check` | Run PHPStan static analysis (level 7) |
| `composer run test` | Run PHPUnit tests with linting and type checks |
| `composer run ci:check` | Full CI check (lint + format + types + tests) |

### npm Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build of frontend assets |
| `npm run build:ssr` | Production build with SSR support |
| `npm run lint` | Auto-fix ESLint issues |
| `npm run lint:check` | Check ESLint issues without modifying files |
| `npm run format` | Auto-format with Prettier |
| `npm run format:check` | Check Prettier formatting without modifying files |
| `npm run types:check` | Run TypeScript type checking |

### Artisan Commands

| Command | Description |
|---|---|
| `php artisan migrate` | Run database migrations |
| `php artisan migrate:fresh --seed` | Reset database and run seeders (dev only) |
| `php artisan tinker` | Interactive REPL |
| `php artisan test` | Run the test suite |
| `php artisan key:generate` | Generate application encryption key |
| `php artisan storage:link` | Create public storage symlink |

---

## Project Structure

```
example-react/
├── app/
│   ├── Actions/
│   │   └── Fortify/
│   │       ├── CreateNewUser.php          # User registration logic
│   │       └── ResetUserPassword.php      # Password reset logic
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Settings/
│   │   │       ├── ProfileController.php  # Profile CRUD
│   │   │       └── SecurityController.php # Password, 2FA & passkeys
│   │   ├── Middleware/
│   │   │   ├── HandleInertiaRequests.php  # Inertia shared data
│   │   │   └── HandleAppearance.php       # Theme preference middleware
│   │   └── Requests/
│   │       └── Settings/                  # Form Request validators
│   ├── Models/
│   │   └── User.php                       # User model (Fortify + 2FA + passkeys)
│   └── Providers/
│       ├── AppServiceProvider.php
│       └── FortifyServiceProvider.php     # Fortify configuration
│
├── database/
│   ├── factories/
│   │   └── UserFactory.php
│   ├── migrations/
│   │   ├── ..._create_users_table.php
│   │   ├── ..._create_cache_table.php
│   │   ├── ..._create_jobs_table.php
│   │   ├── ..._create_passkeys_table.php  # WebAuthn passkeys
│   │   └── ..._add_two_factor_columns_to_users_table.php
│   └── seeders/
│       └── DatabaseSeeder.php
│
├── resources/
│   └── js/
│       ├── app.tsx                        # Inertia client-side entry point
│       ├── components/
│       │   ├── ui/                        # Radix-based UI primitives
│       │   ├── app-header.tsx
│       │   ├── manage-passkeys.tsx
│       │   ├── two-factor-recovery-codes.tsx
│       │   └── ...
│       ├── hooks/                         # Custom React hooks
│       ├── layouts/
│       │   ├── app-layout.tsx             # Authenticated app shell
│       │   ├── auth-layout.tsx            # Authentication pages shell
│       │   └── settings/layout.tsx        # Settings sub-layout
│       ├── pages/
│       │   ├── welcome.tsx                # Public landing page
│       │   ├── dashboard.tsx              # Authenticated dashboard
│       │   ├── auth/                      # Login, register, 2FA, etc.
│       │   └── settings/                  # Profile, security, appearance
│       ├── types/                         # TypeScript type definitions
│       └── lib/utils.ts                   # Shared utilities (cn helper, etc.)
│
├── routes/
│   ├── web.php                            # Web routes (dashboard, welcome)
│   ├── settings.php                       # Settings routes (profile, security)
│   └── console.php                        # Artisan console commands
│
├── tests/
│   ├── Feature/
│   │   ├── Auth/                          # Authentication feature tests
│   │   └── Settings/                      # Settings feature tests
│   └── Unit/
│
├── .github/
│   └── workflows/
│       ├── tests.yml                      # PHPUnit + PHPStan on PHP 8.3–8.5
│       └── lint.yml                       # Pint + Prettier + ESLint
│
├── .env.example                           # Environment template
├── composer.json
├── package.json
├── phpstan.neon                           # PHPStan configuration (level 7)
├── phpunit.xml                            # PHPUnit configuration
├── pint.json                              # Laravel Pint (PHP CS) configuration
├── eslint.config.js                       # ESLint configuration
├── tsconfig.json                          # TypeScript configuration
└── vite.config.ts                         # Vite configuration
```

---

## Deployment Notes

### Production Checklist

1. **Environment** — Set `APP_ENV=production` and `APP_DEBUG=false` in `.env`.
2. **Application key** — Ensure `APP_KEY` is set and kept secret.
3. **Database** — Configure a production database (MySQL/PostgreSQL recommended).
4. **Migrations** — Run `php artisan migrate --force` as part of your release process.
5. **Cache optimisation** — Run the following commands after deployment:

   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

6. **Build frontend assets** — `npm run build` (or `npm run build:ssr` for SSR).
7. **Storage symlink** — `php artisan storage:link` if using public disk.
8. **Queue worker** — Start a persistent queue worker (e.g., via Supervisor or Laravel Horizon).
9. **Mail** — Configure a real SMTP provider (e.g., Mailgun, SES) via `MAIL_*` variables.

### CI/CD

The repository includes two GitHub Actions workflows:

- **`lint.yml`** — Runs PHP Pint, Prettier, and ESLint on every push and pull request.
- **`tests.yml`** — Runs PHPStan (level 7) and PHPUnit across a PHP 8.3–8.5 matrix on every push and pull request.

Both workflows run automatically on pushes to `main`, `master`, and `develop` branches and on all pull requests.

### Laravel Sail (Docker)

For a Docker-based development environment, use [Laravel Sail](https://laravel.com/docs/sail):

```bash
php artisan sail:install
./vendor/bin/sail up
```
