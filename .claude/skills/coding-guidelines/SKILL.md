---
name: coding-guidelines
description: Comprehensive coding standards for PHP 8.2 and Laravel 12 projects. Use when writing new code, refactoring, or setting up project structure. Focuses on e2e type-safety, readability, and maintainability. Apply to any code creation, file structuring, or technical decision-making tasks.
---

# Coding Guidelines

Apply these standards to all PHP 8.2 and Laravel 12 code. Focus on type-safety, readability, and maintainability.

## Technology Stack

-   PHP 8.2
-   Laravel 12
-   PostgreSQL (production and testing)
-   JWT Authentication (tymon/jwt-auth)
-   Spatie Laravel Permission for role management
-   Discord logging integration (marvinlabs/laravel-discord-logger) for logging errors and warnings

## Core Principles

### Type Safety

-   Use eloquent models for database queries, instead of raw SQL queries
-   Always specify parameters and return values ​​of functions and methods

### Code Organization

-   Usually use one level of indentation per function or method
-   Don’t Use The ELSE Keyword, use early returns instead
-   Prefer using Illuminate Collections instead of arrays
-   Prefer using readonly properties instead of public properties

## Development Commands

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

### Code Quality

Lint code (auto-fix):

```bash
composer lint
# or
vendor/bin/pint
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

-   [routes/api.php](routes/api.php): Main API router that loads modular route files
-   [routes/api/auth.php](routes/api/auth.php): Authentication endpoints

### Authentication

The application uses JWT tokens via tymon/jwt-auth:

-   Guard name: `api`
-   Middleware: `jwt` (see [JWTMiddleware.php](app/Http/Middleware/JWTMiddleware.php))
-   All authenticated endpoints use `auth('api')` guard
-   Token expires as configured in [config/jwt.php](config/jwt.php)

### Exception Handling

Custom exception hierarchy in [app/Exceptions/](app/Exceptions/):

-   `HttpException`: Base class with statusCode, errorCode, and optional details
-   `UnauthorizedException`: For 401 responses
-   `UnprocessableEntityException`: For 422 validation/business logic errors
-   `InternalServerErrorException`: For 500 errors

All exceptions are rendered using [ErrorResponse](app/Helpers/ErrorResponse.php) which provides:

-   Consistent JSON structure with `req_id`, `message`, `status_code`, `code`, and optional `details`
-   Automatic SQL query display in debug mode
-   Stack traces filtered to app code only in debug mode

### User Scoping Pattern

The application implements automatic user scoping for multi-tenant data isolation:

**[UserRelation](app/Traits/UserRelation.php) trait**: Add to any model that belongs to a user

-   Automatically sets `user_id` on creation when authenticated
-   Applies global scope to filter by current user
-   Provides `scopeDisableUserScope()` to bypass filtering when needed
-   Adds `user()` relationship

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

-   Update the OpenAPI spec with request/response schemas
-   Include detailed error examples for all status codes

### Helper Functions

Global helpers are autoloaded from [app/helpers.php](app/helpers.php):

-   `cast()->toJsonPretty($data)`: Pretty JSON encoding with UTF-8 support

## Configuration

The application uses Portuguese (Brazil) locale by default:

-   `APP_LOCALE=pt_BR`
-   `APP_FALLBACK_LOCALE=pt`
-   `APP_TIMEZONE="America/Sao_Paulo"`

Translation files are organized by domain:

-   `auth.*`: Authentication messages (e.g., `__('auth.logout')`)
-   `errors.*`: System error messages (e.g., `__('errors.unauthorized')`)
-   `medications.*`: Medication-related messages (e.g., `__('medications.user_medication.created')`)
-   `validation.*`: Laravel validation messages
-   `passwords.*`: Laravel password reset messages

## Key Dependencies

-   `gusvasconcelos/markdown-converter`: Custom markdown conversion
-   `spatie/laravel-permission`: Role and permission management
-   `marvinlabs/laravel-discord-logger`: Discord logging integration
-   `tymon/jwt-auth`: JWT authentication
