# AI_PROMPT.md

## Purpose

Single source of truth for how to communicate with AI agents for this project. Define required context, response format, safety rules and prompt templates so outputs are precise, actionable and safe.

## Project summary (include in prompts)

- Stack: PHP (Composer), TypeScript / JavaScript (npm), React
- Backend style: REST API, versioned routes, relational DB, migrations under `database/migrations/`
- Tests: PHPUnit, Jest
- Linters: PHP-CS-Fixer, ESLint, Prettier
- CI: GitHub Actions

## What to include in every prompt
Provide the minimal context to produce correct code:
1. Framework and exact versions (e.g., Laravel 10, Symfony 6, React 18, Node 18).
2. Target file path(s) relative to repo root, or code snippet.
3. Desired behavior and constraints (performance, backward compatibility, security).
4. Example requests/responses or OpenAPI path if API related.
5. Indicate backend/frontend/infra and target environment (dev/staging/prod).

## Rules for AI responses
- Keep answers concise and task-focused.
- Show commands and code in fenced code blocks.
- Provide:
  1. Short explanation (1--2 lines).
  2. Precise code diff or full file content.
  3. Tests to add or update (brief outline).
  4. Risk and migration notes if applicable.
- Ask clarifying questions if essential context is missing.
- Never output secrets, tokens, or `.env` contents.
- Prefer small, reviewable changes over sweeping refactors.

## Format conventions
- Use English in generated files and comments.
- PHP: follow PSR-12.
- TypeScript: strict typing; prefer `readonly` where applicable.
- Filenames: follow language convention (kebab-case for JS assets, PascalCase for PHP classes).
- Use OpenAPI for public endpoints and include a single example request (curl) and JSON response.

## Laravel-specific guidance

When the project uses Laravel, prompts and generated changes must include the Laravel version (e.g., "Laravel 10"). The following guidance helps the AI produce accurate, framework-consistent code and commands.

Key concepts to include in Laravel-related prompts:
- Framework version (Laravel 8/9/10 etc.)
- Target files (e.g., `routes/api.php`, `app/Http/Controllers/TaskController.php`, `app/Http/Requests/StoreTaskRequest.php`)
- Whether to use API resources (`JsonResource`) and Form Requests for validation
- Any package expectations (Sanctum, Passport, Horizon, Telescope, Scribe)

Common artisan commands (use in examples and CI):
```
php artisan serve --host=127.0.0.1 --port=8000
php artisan migrate --env=local
php artisan migrate --force          # use in CI/deploy scripts with caution
php artisan migrate:fresh --seed     # dev only
php artisan db:seed
php artisan route:cache
php artisan config:cache
php artisan view:cache
php artisan storage:link
php artisan queue:work --tries=3
php artisan queue:restart
```

Migrations and schema changes:
- Prefer non-blocking changes: add nullable columns, deploy backfill jobs, then alter to NOT NULL in a safe follow-up migration.
- Keep migrations small and reversible; name them clearly (e.g., `20250623_add_priority_to_tasks_table.php`).
- In CI/deploy use `php artisan migrate --force` and run backups or snapshot strategy before production migrations. Mark destructive operations with [RISK].

Routing, controllers and validation conventions:
- Put API routes in `routes/api.php` and version them with a prefix (e.g., `Route::prefix('v1')->group(...)`).
- Use `Route::apiResource()` or `Route::resource()` for RESTful patterns.
- Use route model binding (`tasks/{task}`) and `->scopeBindings()` when needed.
- Keep controllers thin: use Form Requests for validation/authorization and delegate business logic to Services/Actions.

Eloquent and data layer:
- Use Eloquent models with casts and accessors; keep complex queries in repository/query objects.
- Use eager loading to prevent N+1 queries and add proper indexes for frequently queried columns.
- Use `SoftDeletes` for recoverable resources when appropriate.

Authorization & policies:
- Use Policies (`php artisan make:policy`) and register them in `AuthServiceProvider`.
- Prefer to check authorization in controllers or service layer using `$this->authorize()` or `Gate::allows()`.

Queues and background jobs:
- Use Jobs for async work and configure Redis + Horizon for production monitoring.
- Ensure jobs are idempotent, handle retries and use backoff strategies.

Testing in Laravel:
- Prefer `php artisan test` (wrapper for PHPUnit) and use `RefreshDatabase` or `DatabaseTransactions` as appropriate.
- Use model factories, HTTP tests, and assert JSON responses using `assertJson` / `assertJsonStructure`.

Dev tools and documentation:
- Use Telescope for debugging (non-production) and Scribe or OpenAPI tools for API documentation.
- Use `php artisan tinker` for quick debugging in local env.

Prompt examples for Laravel-specific tasks (include these fields in prompts):
```
Context:
- Framework: Laravel 10
- Files to edit: routes/api.php, app/Http/Controllers/TaskController.php, app/Http/Requests/StoreTaskRequest.php
- Goal: Add POST /api/v1/tasks to create a task using Form Request validation, TaskService, and TaskResource for response.

Provide:
1. Route definition
2. Controller method
3. Form Request class skeleton
4. Service method signature and short description
5. Unit or feature test outline
```

## How to run common tasks (examples)
- Install dependencies:

```
composer install
npm install
```

- Run backend dev server (Laravel example):

```
php artisan serve --host=127.0.0.1 --port=8000
```

- Run frontend dev server (React):

```
npm start
```

- Run migrations (Laravel):

```
php artisan migrate --env=local
```

- Run migrations (Symfony / Doctrine):

```
php bin/console doctrine:migrations:migrate
```

- Run tests:

```
vendor/bin/phpunit
npm test
```

Always mention environment and path to `.env` without printing its contents.

## Prompt templates

### 1. Implement or fix an endpoint
Context:
- Framework: Laravel 10
- File: `app/Http/Controllers/TaskController.php`
- Goal: Add `PATCH /api/v1/tasks/{id}/complete` to mark a task as completed and return 200 with updated resource.

Constraints:
- Use Form Request for validation
- Use `TaskService->markComplete(id, userId)`
- Return 404 if not found, 403 if unauthorized

Provide:
1. Controller method
2. Route definition
3. Brief service method signature and behavior
4. Unit test outline

### 2. Add non-breaking migration
Context:
- Framework: Laravel 10
- Path: `database/migrations/`
- Goal: Add `priority` integer column to `tasks` table with default `0` safely.

Provide:
1. Migration file content (up/down)
2. Backfill strategy and rollback steps
3. CI steps to run migration in staging before production

### 3. Create API contract
Context:
- Path: `docs/openapi.yaml`
- Goal: Add endpoint spec for `POST /api/v1/tasks` with request and response schema.

Provide:
1. OpenAPI path snippet
2. Example curl request and JSON response
3. Possible error responses and status codes

## Error handling and safety
- If an operation may cause data loss or is destructive, mark steps with [RISK] and require manual confirmation.
- If framework or version is ambiguous, ask before changing files.
- Suggest migration windows and backups for production database changes.

## Security and privacy
- Never expose `.env` or credentials.
- Recommend storing secrets in a secret manager or GitHub Secrets.
- Avoid printing secrets in CI logs.

## Examples of good prompts
- "How to run migrations in this Laravel 10 project? Provide exact commands and path to `.env`."
- "Add an endpoint to soft-delete tasks using best practices: controller, service, request validation and tests. Files to change: `app/Http/Controllers/TaskController.php`, `app/Services/TaskService.php`, `tests/Feature/TaskTest.php`."

## Quick checklist for AI responses
- Is framework/version specified? If not, ask.
- Are file paths provided? If not, ask.
- Are expected HTTP codes and error format described? If not, ask.
- Provide commands in fenced code blocks.
- Include risk notes for destructive steps.

## Maintenance
- Update this file when stack or conventions change.
- Add new agent descriptions to `AGENTS.md`.
