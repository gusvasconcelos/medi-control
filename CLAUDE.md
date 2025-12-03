# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MediControl is a medication treatment control system for polymedicated patients, built with Laravel 12, PostgreSQL, React 19, and TypeScript. The application is a server-side rendered SPA using Inertia.js with session-based authentication via Sanctum.

## Architecture

### Backend Stack

-   **Framework**: Laravel 12 with PHP 8.2
-   **Database**: PostgreSQL 15
-   **Queue**: Redis via Laravel Horizon
-   **Auth**: Laravel Sanctum (session-based for SPA, tokens for mobile)
-   **Routing**: Laravel Wayfinder for type-safe routes
-   **AI**: OpenAI PHP Client for medication interactions and chat
-   **Monitoring**: Laravel Pulse (performance), Discord Logger (errors)
-   **Permissions**: Spatie Laravel Permission for role-based access

### Frontend Stack

-   **Framework**: React 19.2.0 with TypeScript 5.9.3 (strict mode)
-   **Bridge**: Inertia.js 2.2.18 (server-side rendered SPA)
-   **Styling**: Tailwind CSS 4 + DaisyUI 5
-   **Build**: Vite 6.2
-   **HTTP**: Axios 1.8.2
-   **AI Chat**: Vercel AI SDK (`@ai-sdk/react`, `ai`)
-   **Path Alias**: `@/*` maps to `resources/js/*`

**Full guidelines:** See `.claude/skills/fullstack-development/SKILL.md` for complete standards and examples.

## Git Workflow

-   Do not include "Claude Code" in commit messages
-   Follow conventional commit format when appropriate
-   Test before committing
