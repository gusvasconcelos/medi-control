---
name: fullstack-development
description: Comprehensive fullstack development skill for MediControl. Use when building end-to-end features that involve both backend (PHP 8.2/Laravel 12) and frontend (React 19/TypeScript/Inertia.js). Enforces Service Layer pattern, early returns, immutability, and Laravel Wayfinder routing.
---

# Fullstack Development Guidelines

Apply these standards to all PHP, Laravel, React, TypeScript, Inertia.js, Tailwind CSS, and DaisyUI code in the MediControl project.

## Technology Stack

-   **Backend**: PHP 8.2, Laravel 12, PostgreSQL, Horizon, Sanctum, Wayfinder, Spatie Permission, OpenAI, Pulse/Discord Logger
-   **Frontend**: React 19, TypeScript 5 (strict), Inertia 2, Tailwind 4 + DaisyUI 5, Vite 6, Axios, Vercel AI SDK

## Core Principles

-   **Service Layer**: All business logic in `app/Services`, never in controllers. Controllers only orchestrate: receive Request, call Service, return response/Inertia.
-   **No `else` – early returns**: Avoid nested `else`; use `if` + `return` as soon as possible. Valid for PHP and TypeScript.
-   **Immutability**: Do not mutate arrays/objects directly. Backend: use `Collection` (`collect()->push()->map()...`). Frontend: use `setState` with copies (`{ ...obj }`, `[...arr]`, `map`, `filter`).
-   **Semantic HTML**: Never use `<div onClick>`. Use `<button>` for actions, `<a>` for navigation.
-   **No `console.log` in production**: Logs only for development and removed before commit. Real errors: throw exceptions and let error boundaries/handler handle them.
-   **No inline styles**: Styling always with Tailwind + DaisyUI, never `style={{ ... }}`.
-   **Eloquent + Typing**: Use Eloquent and Scopes, no raw SQL. Tip everything (PHP: parameters/returns; TS: interfaces for requests/responses, props etc.).
-   **Try–catch only for batch**: Normal flows: let exceptions bubble to global handler. Use `try-catch` only for batch operations (e.g. import CSV) to count successes/failures and log.
-   **Don't use JSON Response return**: Always prefer to return an Inertia response, to maintain a new standard migrating from API to Inertia.
-   **Use Wayfinder for routing**: Use Wayfinder for routing, to maintain a new standard migrating from Laravel to Wayfinder.

## Checklist – Backend

-   [ ] Business logic only in Services
-   [ ] Methods and parameters typed
-   [ ] No `else` – only early returns
-   [ ] Using `Collection` instead of loose arrays
-   [ ] Only Eloquent (no raw SQL), with scopes when it makes sense
-   [ ] Try–catch used only for batch operations
-   [ ] FormRequests for all input validation
-   [ ] Don't use JSON Response return
-   [ ] Use Wayfinder for routing

## Checklist – Frontend

-   [ ] TypeScript in strict mode without errors
-   [ ] Components and props typed correctly
-   [ ] State updated immutably (no direct mutation)
-   [ ] No `console.log` in final code
-   [ ] No inline style (only Tailwind + DaisyUI)
-   [ ] No `div` used as button (semantic HTML)
-   [ ] Responsive layout and accessible (ARIA, keyboard, loading/error)
-   [ ] Use Wayfinder for routing
