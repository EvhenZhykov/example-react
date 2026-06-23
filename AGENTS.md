# AGENTS.md

## Project stack

- PHP (Laravel backend)
- Composer (PHP package manager)
- TypeScript / JavaScript (frontend)
- npm / Node.js (frontend tooling)
- React (frontend)
- Database: relational (MySQL / PostgreSQL)
- CI/CD: GitHub Actions (recommended)
- Testing: PHPUnit (PHP), Jest + React Testing Library (frontend)
- Lint / Format: PHP-CS-Fixer / ESLint / Prettier
- Static analysis: phpstan / psalm / TypeScript strict mode
- Containerization: Docker (optional)

## Laravel-specific notes

- Framework: Laravel (specify version in prompts, e.g., Laravel 10). Many recommendations below assume Laravel conventions.
- Common Laravel tools: Eloquent ORM, Artisan CLI, Service Providers, Form Requests, Policies & Gates, Resources (API Resources), Jobs/Queues, Events/Listeners, Broadcasting, Scout (search), Telescope (debugging), Horizon (queues), Scribe or OpenAPI packages for docs.
- Auth options: Sanctum (SPA/mobile), Passport (OAuth server) or JWT (third-party) depending on needs.

Include the Laravel version in any agent action or code change requests (e.g., "Laravel 10").

## Laravel best practices (apply alongside general best practices)

- Project layout: follow Laravel conventions (app/, routes/, config/, database/, resources/, tests/). Prefer feature grouping for large apps (e.g., app/Modules/ or app/Domain/Feature).
- Routing:
  - Use `routes/api.php` for API routes and `routes/web.php` for web routes.
  - Use `Route::apiResource()` for RESTful controllers when applicable and `Route::prefix('v1')->group(...)` for versioning.
  - Use route model binding and implicit binding where possible: `Route::get('tasks/{task}', ...);`

- Controllers & Requests:
  - Keep controllers thin: validate (Form Request), authorize, call a Service/Action class, return API Resource.
  - Use Form Requests for validation and authorization (`php artisan make:request StoreTaskRequest`).
  - Prefer single-action controllers (invokable) for very small endpoints.

- Services / Actions:
  - Encapsulate business logic in Services or Action classes (e.g., `app/Services/TaskService.php` or `app/Actions/Tasks/CreateTask.php`).
  - Use the service container for dependency injection; bind interfaces to implementations in Service Providers.

- Eloquent & DB:
  - Use Eloquent models, but keep complex queries in Repositories or query objects.
  - Use casts, accessors/mutators, and Eloquent events/observers for model behavior.
  - Soft deletes for resources that require recoverability (`use SoftDeletes`).

- Policies & Authorization:
  - Use Policies for model resource authorization (`php artisan make:policy TaskPolicy --model=Task`) and register them in `AuthServiceProvider`.
  - Prefer policy checks in controllers or service layer, not scattered across models.

- API Resources & Transformers:
  - Use `JsonResource` and `ResourceCollection` to shape API responses and hide internal fields.

- Validation & Error Handling:
  - Return 422 for validation errors (handled by Form Requests). Use custom exception handler (`app/Exceptions/Handler.php`) to map domain exceptions to proper HTTP responses.

- Migrations & Seeding:
  - Use descriptive migration filenames and keep migrations small and reversible.
  - Backfill data safely: add nullable column, run backfill job, then make column non-null.
  - Helpful artisan commands: `php artisan migrate`, `php artisan migrate:fresh --seed` (dev), `php artisan migrate --force` (in CI/production deploy scripts with caution).

- Queues & Jobs:
  - Use Jobs for async work; prefer Redis queue in production and configure Horizon for monitoring.
  - Ensure idempotency for jobs and proper retry/backoff policies.

- Caching & Performance:
  - Use route caching (`php artisan route:cache`) and config caching (`php artisan config:cache`) in deployment pipelines.
  - Use eager loading to avoid N+1 queries and database indexes for frequently queried columns.

- Testing in Laravel:
  - Use Laravel's testing helpers (HTTP tests via `Illuminate\Testing\TestResponse`, model factories, database migrations in tests).
  - Use `RefreshDatabase` or `DatabaseTransactions` trait depending on DB driver and speed.
  - Write feature tests for API endpoints and unit tests for services.

- Dev & Debug tools:
  - Use Telescope in non-production for debugging and Horizon for queue monitoring. Use Xdebug for local debugging when needed.

- Documentation & API contracts:
  - Use a tool like Scribe or a maintained OpenAPI spec to keep API docs in sync.

- Ops & deployment notes:
  - Use `php artisan config:cache`, `route:cache`, `view:cache` in CI for production builds.
  - Use `php artisan storage:link` when deploying to environments that require public storage.
  - Run migrations as part of release process with backups and maintenance windows.

---

## Purpose

This file describes autonomous agents, their responsibilities, required tooling and project conventions. It also documents best practices to ensure consistent, maintainable code and predictable automated behavior when creating routes, controllers, services, migrations, tests and documentation.

---

## Agents overview

Each agent below is a persona or automation with explicit responsibilities, allowed tools and constraints. Agents should read `AI_PROMPT.md` before taking any action.

### Agent: CodeReviewer
- Role: automated code review for pull requests.
- Tools: php-cs-fixer, phpstan, psalm, eslint, stylelint, snyk.
- Responsibilities:
  - Enforce PSR-12 and project-specific PHP rules.
  - Enforce TypeScript linting and formatting.
  - Run static analysis and unit tests.
  - Suggest minimal, safe fixes and provide patch snippets.
- Constraints:
  - Do not push breaking changes directly; propose suggested commits or PR comments only.

### Agent: APIResponder
- Role: maintain API contracts and provide example requests/responses.
- Tools: OpenAPI/Swagger, jsonschema validator.
- Responsibilities:
  - Keep the OpenAPI spec in sync with implementation.
  - Provide request/response examples and error schemas.
  - Flag breaking changes and require version bump/review for them.
- Constraints:
  - Follow semantic versioning; do not alter public contract without explicit review.

### Agent: DocsAssistant
- Role: author and update developer documentation, examples and migration notes.
- Tools: markdown-lint, templating.
- Responsibilities:
  - Generate concise, copy-pasteable examples.
  - Keep docs free of secrets and environment values.
- Constraints:
  - Avoid large, disruptive doc refactors without a PR.

### Agent: TestRunner
- Role: run unit, integration, and E2E tests in CI.
- Tools: PHPUnit, Jest, Playwright / Cypress.
- Responsibilities:
  - Fail CI on test regressions.
  - Report flaky tests and mark them for human triage.
- Constraints:
  - Do not auto-rerun indefinitely; require human action for flakiness.

### Agent: DeployAgent
- Role: orchestrate builds and deployments to environments.
- Tools: Docker, GitHub Actions, Helm (optional).
- Responsibilities:
  - Build reproducible artifacts, run migrations, perform health checks.
  - Support rollback and deploy approvals.
- Constraints:
  - Require manual approvals for production deploys.

---

## Coding & architecture best practices

### Project layout (recommended)
- `app/` or `src/` — core backend code (controllers, services, models)
- `routes/` — route definitions (versioned)
- `database/migrations/` — migration files
- `resources/` or `frontend/` — React application
- `tests/` — unit and integration tests
- `docs/` — architecture and API docs
- `scripts/` — helper scripts (lint, format, checks)
- `config/` — configuration (non-secret)

### Layered architecture
- Controllers: HTTP layer only — validate, authorize, call service, return response.
- Request validators / FormRequests: encapsulate validation rules.
- Services / Use cases: business logic and transaction boundaries.
- Repositories / Data mappers: database interactions returning domain objects or DTOs.
- DTOs / Resources / Serializers: define external API shape.

Keep single responsibility per component and small, testable methods.

### Routing and controllers
- Use resourceful routes and proper HTTP verbs:
  - GET `/api/v1/tasks` — list
  - POST `/api/v1/tasks` — create
  - GET `/api/v1/tasks/{id}` — retrieve
  - PUT `/api/v1/tasks/{id}` — replace
  - PATCH `/api/v1/tasks/{id}` — partial update
  - DELETE `/api/v1/tasks/{id}` — delete
- Version APIs in the path: `/api/v1/` and introduce `/api/v2/` for breaking changes.
- Keep controllers thin: validate, authorize, call service, return Resource/DTO.
- Use named routes and route model binding where framework supports it.
- Group routes by feature and keep routing files small.

### REST best practices
- Use appropriate status codes:
  - 200 OK, 201 Created, 204 No Content
  - 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
  - 422 Unprocessable Entity (validation errors)
  - 429 Too Many Requests, 500 Internal Server Error
- Return a consistent error structure, e.g.:
  - `{ "errors": [{ "field": "name", "message": "required" }] }`
- Support pagination, filtering and sorting via query params: `?page=1&limit=20&sort=-created_at`
- Use PATCH for partial updates and make non-GET operations idempotent when required.
- Use ETag or Last-Modified for caching when applicable.
- Document endpoints in OpenAPI and keep examples curated.

### Validation and error handling
- Centralize validation in Request classes or validators.
- Map exceptions to HTTP responses in a single exception handler or middleware.
- Avoid exposing stack traces or internal details in production responses.

### Authentication and authorization
- Prefer token-based auth for APIs (JWT or opaque tokens).
- Perform authorization checks at the service or policy layer, not only in controllers.
- Use scopes/roles and granular permission checks.
- Rate limit auth endpoints and critical APIs.

### Database and migrations
- Name migrations clearly: `YYYYMMDDHHMMSS_action_table` or descriptive name with timestamp.
- Make migrations reversible and small.
- Run migrations in CI and use backups and migration checks for production deploys.
- Prefer non-blocking schema changes: add nullable columns, backfill, then set NOT NULL.
- Wrap schema changes in transactions when supported.

### Testing
- Unit tests for services and utilities.
- Integration tests for repositories and controllers (use a test DB).
- E2E tests for critical user flows.
- Use test data factories and avoid brittle fixtures.
- Keep tests deterministic and enforce them in CI.

### Logging, metrics and monitoring
- Use structured logs (JSON) with `request_id` and `user_id` when available.
- Capture metrics for latency, success/error rates and saturation.
- Integrate Sentry or similar for exceptions and alerts.

### Security
- Validate and sanitize all inputs.
- Use prepared statements or ORM to prevent SQL injection.
- Secure cookies, CORS and CSP for frontend.
- Rotate secrets; store secrets in a secret manager or CI secrets.
- Enforce HTTPS and HSTS in production.

### Frontend (React + TypeScript) best practices
- Use TypeScript strict mode.
- Prefer functional components and hooks.
- Co-locate component, styles and tests.
- Keep components small and extract business logic into hooks/services.
- Use ESLint, Prettier and consistent import ordering.
- Map backend errors to friendly UI messages; do not expose raw stack traces.

### CI / CD and developer workflow
- Provide a PR template and require reviewers.
- Enforce linting, static analysis and tests in CI.
- Use feature branches and feature flags for large changes.
- Use semantic commit messages (Conventional Commits) and automated changelogs.
- Protect main branches with required status checks.

## Agent interaction rules
- Agents must require explicit file paths and minimal reproducible context before proposing code changes.
- Never include secrets or credentials in comments or outputs.
- Provide commands in fenced code blocks only.
- Add risk notes for destructive operations (migrations, destructive DB ops) and require manual confirmation.
- When uncertain, ask for framework and version before modifying files.

## Example templates
- PR comment from CodeReviewer: summary, severity, minimal reproduction and suggested code snippet.
- OpenAPI endpoint snippet: path, method, request schema, response schema and example.

## Onboarding checklist for a new agent
1. Read `AI_PROMPT.md` and `AGENTS.md`.
2. Configure required tools (linters, analyzers).
3. Register CI hooks and required permissions.
4. Run against a sample PR and report results to maintainers.
