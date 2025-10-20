# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Medi Control is a medication treatment control system for polymedicated patients, built with Laravel 12, PostgreSQL, and Redis. The application is API-first with JWT authentication.

## Technology Stack

- PHP 8.2
- Laravel 12
- PostgreSQL (production and testing)
- Redis
- JWT Authentication (tymon/jwt-auth)
- Spatie Laravel Permission for role management
- Discord logging integration (marvinlabs/laravel-discord-logger)

## Development Commands

### Running the Development Environment

```bash
composer dev
```

This runs a concurrent setup with:
- PHP development server (`php artisan serve`)
- Queue worker (`php artisan queue:listen`)
- Pail logs (`php artisan pail`)
- Vite dev server (`npm run dev`)

### Testing

Run all tests:
```bash
composer test
# or
php artisan test
```

Run a specific test file:
```bash
php artisan test tests/Feature/Http/Controllers/Api/AuthControllerTest.php
```

Run a specific test method:
```bash
php artisan test --filter test_method_name
```

**Important**: Tests use PostgreSQL database `medi_control_db` as configured in [phpunit.xml](phpunit.xml).

### Code Quality

Lint code (auto-fix):
```bash
composer lint
# or
vendor/bin/pint
```

View what would be fixed without applying changes:
```bash
composer lint:view
```

Test linting without fixing:
```bash
composer lint:test
```

Static analysis with PHPStan (level 5):
```bash
vendor/bin/phpstan analyse
```

### Database

Run migrations:
```bash
php artisan migrate
```

Seed database:
```bash
php artisan db:seed
```

## Architecture

### API Structure

All API routes are versioned under `/api/v1`. Route files are organized in [routes/api/](routes/api/):
- [routes/api.php](routes/api.php): Main API router that loads modular route files
- [routes/api/auth.php](routes/api/auth.php): Authentication endpoints

### Authentication

The application uses JWT tokens via tymon/jwt-auth:
- Guard name: `api`
- Middleware: `jwt` (see [JWTMiddleware.php](app/Http/Middleware/JWTMiddleware.php))
- All authenticated endpoints use `auth('api')` guard
- Token expires as configured in [config/jwt.php](config/jwt.php)

### Exception Handling

Custom exception hierarchy in [app/Exceptions/](app/Exceptions/):
- `HttpException`: Base class with statusCode, errorCode, and optional details
- `UnauthorizedException`: For 401 responses
- `UnprocessableEntityException`: For 422 validation/business logic errors
- `InternalServerErrorException`: For 500 errors

All exceptions are rendered using [ErrorResponse](app/Helpers/ErrorResponse.php) which provides:
- Consistent JSON structure with `req_id`, `message`, `status_code`, `code`, and optional `details`
- Automatic SQL query display in debug mode
- Stack traces filtered to app code only in debug mode

### User Scoping Pattern

The application implements automatic user scoping for multi-tenant data isolation:

**[UserRelation](app/Traits/UserRelation.php) trait**: Add to any model that belongs to a user
- Automatically sets `user_id` on creation when authenticated
- Applies global scope to filter by current user
- Provides `scopeDisableUserScope()` to bypass filtering when needed
- Adds `user()` relationship

**[UserScope](app/Models/Scopes/UserScope.php)**: Global scope that filters queries by `auth('api')->id()`

Usage:
```php
use App\Traits\UserRelation;

class MyModel extends Model
{
    use UserRelation;
}
```

To query across all users (admin scenarios):
```php
MyModel::disableUserScope()->get();
```

### Form Requests

All input validation uses FormRequest classes in [app/Http/Requests/](app/Http/Requests/). The framework automatically handles validation errors and returns them via the custom exception handler.

### API Documentation

OpenAPI 3.1 specification is maintained in [openapi.yaml](openapi.yaml). When adding or modifying endpoints:
- Update the OpenAPI spec with request/response schemas
- Include detailed error examples for all status codes
- Document authentication requirements

### Helper Functions

Global helpers are autoloaded from [app/helpers.php](app/helpers.php):
- `cast()->toJsonPretty($data)`: Pretty JSON encoding with UTF-8 support

## Configuration

The application uses Portuguese (Brazil) locale by default:
- `APP_LOCALE=pt_BR`
- `APP_FALLBACK_LOCALE=pt`
- `APP_TIMEZONE="America/Sao_Paulo"`

Translation files should use the `messages` domain (e.g., `__('messages.auth.login_success')`).

## Deployment

The application is configured for Fly.io deployment via [fly.toml](fly.toml):
- Production URL: https://medi-control.fly.dev
- Release command runs migrations and clears cache
- Auto-scaling configured with minimum 0 machines

## Key Dependencies

- `gusvasconcelos/markdown-converter`: Custom markdown conversion
- `spatie/laravel-permission`: Role and permission management
- `marvinlabs/laravel-discord-logger`: Discord logging integration
- `tymon/jwt-auth`: JWT authentication