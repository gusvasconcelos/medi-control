# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MediControl is a medication treatment control system for polymedicated patients, built with Laravel 12, PostgreSQL, React 19, and TypeScript. The application is API-first with JWT authentication via Sanctum.

## Architecture

### Backend Stack
- **Framework**: Laravel 12 with PHP 8.2
- **Database**: PostgreSQL (supports full-text search with UNACCENT)
- **Queue**: RabbitMQ via Horizon for job management
- **Auth**: Laravel Sanctum with JWT tokens
- **AI**: OpenAI PHP Client for medication interactions and chat
- **Monitoring**: Laravel Pulse (performance), Discord Logger (errors)
- **Permissions**: Spatie Laravel Permission for role-based access

### Frontend Stack
- **Framework**: React 19 with TypeScript 5.9
- **Bridge**: Inertia.js 2.2 (server-side rendered SPA)
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **Build**: Vite 6.2
- **AI Chat**: Vercel AI SDK (`@ai-sdk/react`, `ai`)
- **Path Alias**: `@/*` maps to `resources/js/*`

### Service Layer Pattern
Business logic lives in `app/Services/`, organized by domain:
- Core: `AuthService`, `UserService`, `ChatService`, `MedicationLogService`
- Features: `HealthAssistantService`, `ChatInteractionCheckerService`, `MedicationReorganizationService`
- Domains: `Medication/`, `Notification/`, `Monitoring/`, `FileUpload/`

Controllers should be thin and delegate to services.

### API Structure
- **Prefix**: `/api/v1/`
- **Modular Routes**: Split across `routes/api/` files (auth, medications, user-medications, caregiver-patient, notifications, chat)
- **Auth Guard**: `auth:sanctum` middleware for protected routes
- **Admin Routes**: Use `role:super-admin` middleware

### Custom Artisan Commands
```bash
php artisan medications:mark-missed    # Mark overdue logs as missed
php artisan medications:import {file}  # Import from CSV/XLS/XLSX
php artisan notifications:schedule     # Schedule medication reminders
php artisan notifications:send         # Send pending notifications
php artisan make:service {name}        # Generate service class
```

### AI Integration
Two distinct OpenAI models configured in `config/openai.php`:
- **Interaction Checker**: `gpt-5-nano` for fast drug interaction detection
- **Health Assistant**: `gpt-5` for patient chat with conversation history (20 messages)

Chat includes tool execution for medication reorganization.

### Key Database Tables
- `users`, `medications`, `user_medications`, `medication_logs`
- `chat_sessions` (24h expiry), `chat_messages`
- `caregiver_patient`, `interaction_alerts`, `side_effects`
- `notification_preferences`, `adherence_reports`
- `roles`, `permissions` (Spatie)

## Development Commands

### Common Workflows
```bash
# Full dev environment (server + queue + logs + vite)
composer dev

# Frontend only
npm run dev

# Testing
composer test              # Run test suite
php artisan test          # Direct test command

# Code Quality
composer lint             # Fix code style with Pint
composer lint:test        # Check style without changes
./vendor/bin/phpstan      # Static analysis (Level 5)

# Build
npm run build             # Production build
```

### Testing
- **Framework**: PHPUnit 11.5
- **Structure**: `tests/Unit/` and `tests/Feature/`
- **Database**: PostgreSQL configured in `phpunit.xml`

## Important Concepts

Focus on these principles in all code:

- **e2e type-safety**: Full TypeScript frontend, strict PHP 8.2 types
- **error monitoring/observability**: Discord logging, Pulse monitoring
- **automated tests**: PHPUnit test coverage for services and features
- **readability/maintainability**: Clear code over clever code

All detailed coding guidelines are in the skills:

- Use `coding-guidelines` skill for programming standards
- Use `frontend-development` skill for React/TypeScript/Inertia patterns

## Git Workflow

- Do not include "Claude Code" in commit messages
- Follow conventional commit format when appropriate
- Test before committing

## Code Conventions

### Frontend
- **Types**: Define in `resources/js/types/`
- **Services**: API calls in `resources/js/services/`
- **Components**: Organized by feature in `resources/js/Components/`
- **Pages**: Inertia pages in `resources/js/Pages/`
- **Imports**: Use `@/` alias for cleaner paths

### Backend
- **Requests**: Form validation in `app/Http/Requests/`
- **Models**: Use `app/Models/` with relationships defined
- **Services**: Business logic extracted from controllers
- **Jobs**: Async processing in `app/Jobs/`
- **Enums**: Type-safe enums in `app/Enums/`

## Monitoring & Debugging

### Available Dashboards
- **Horizon**: `/horizon` - Queue job monitoring and retry
- **Pulse**: `/pulse` - Application performance metrics

### Development Tools
- **Laravel Pail**: Real-time log streaming (`php artisan pail`)
- **Tinker**: Interactive shell (`php artisan tinker`)
- **Discord Logging**: Errors sent to Discord webhook
