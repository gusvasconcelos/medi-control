---
name: fullstack-development
description: Comprehensive fullstack development skill for MediControl. Use when building end-to-end features that involve both backend (PHP 8.2/Laravel 12) and frontend (React 19/TypeScript/Inertia.js). Enforces Service Layer pattern, early returns, immutability, and Laravel Wayfinder routing.
---

# Fullstack Development Guidelines - MediControl

Apply these standards to all fullstack development in the MediControl project, combining PHP 8.2, Laravel 12, React 19, TypeScript 5, Inertia.js 2, Tailwind CSS 4, and DaisyUI 5.

## Technology Stack

### Backend

-   **PHP**: 8.2+ with strict types
-   **Framework**: Laravel 12
-   **Database**: PostgreSQL 15 (full-text search with UNACCENT)
-   **Queue**: RabbitMQ via Laravel Horizon
-   **Auth**: Laravel Sanctum (session for SPA, tokens for mobile)
-   **Routing**: Laravel Wayfinder for type-safe routes
-   **Permissions**: Spatie Laravel Permission
-   **AI**: OpenAI PHP Client
-   **Monitoring**: Laravel Pulse, Discord Logger

### Frontend

-   **React**: 19.2.0 with modern hooks
-   **TypeScript**: 5.9.3 (strict mode)
-   **Bridge**: Inertia.js 2.2.18
-   **Styling**: Tailwind CSS 4 + DaisyUI 5
-   **Build**: Vite 6.2
-   **HTTP**: Axios 1.8.2
-   **AI Chat**: Vercel AI SDK

## Core Development Principles

### 1. Service Layer Pattern (MANDATORY)

All business logic MUST be in service classes, never in controllers.

**Structure:**

```
app/Services/
├── AuthService.php
├── UserService.php
├── ChatService.php
├── Medication/
│   ├── MedicationService.php
│   └── MedicationInteractionService.php
├── Notification/
│   └── NotificationService.php
└── Monitoring/
    └── MonitoringService.php
```

**Controller Example (Thin):**

```php
<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Medication\CreateMedicationRequest;
use App\Services\Medication\MedicationService;
use Inertia\Inertia;
use Inertia\Response;

final class MedicationController extends Controller
{
    public function __construct(
        private readonly MedicationService $medicationService
    ) {}

    public function store(CreateMedicationRequest $request): Response
    {
        $medication = $this->medicationService->create(
            $request->validated()
        );

        return Inertia::render('Medications/Create', [
            'medication' => $medication,
        ]);
    }
}
```

**Service Example:**

```php
<?php

namespace App\Services\Medication;

use App\Models\Medication;
use App\Exceptions\UnprocessableEntityException;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Packages\Filter\FilterQ;

final class MedicationService
{
    /**
     * Create a new medication.
     *
     * @param Collection<int, Medication> $data
     */
    public function create(Collection $data): Medication
    {
        $name = $data->get('name');

        $alreadyExistsMedication = Medication::where('name', $name)->first();

        if ($alreadyExistsMedication) {
            throw new UnprocessableEntityException(__('medications.duplicate'));
        }

        return Medication::create($data->toArray());
    }

    /**
     * Get paginated medications.
     *
     * @param Request $request
     * @return LengthAwarePaginator<int, Medication>
     */
    public function index(Request $request): LengthAwarePaginator
    {
        return FilterQ::applyWithPagination(Medication::query(), collect($request->all()));
    }
}
```

### 2. No ELSE - Use Early Returns (MANDATORY)

Never use `else` keyword. Always use early returns for cleaner code.

**❌ Bad:**

```php
public function getDiscount(User $user): float
{
    if ($user->isPremium()) {
        return 0.20;
    } else {
        if ($user->isRegular()) {
            return 0.10;
        } else {
            return 0.0;
        }
    }
}
```

**✅ Good:**

```php
public function getDiscount(User $user): float
{
    if ($user->isPremium()) {
        return 0.20;
    }

    if ($user->isRegular()) {
        return 0.10;
    }

    return 0.0;
}
```

**TypeScript Example:**

```typescript
function processPayment(amount: number, user: User): PaymentResult {
    // Early validation
    if (amount <= 0) {
        return { success: false, error: "Invalid amount" };
    }

    if (!user.hasPaymentMethod()) {
        return { success: false, error: "No payment method" };
    }

    // Main logic
    return { success: true, transactionId: "123" };
}
```

### 3. Immutability - No State Mutation (MANDATORY)

Never mutate state directly. Always create new instances.

**Backend (Collections):**

```php
// ❌ Bad - Mutates array
$users[] = $newUser;
sort($users);

// ✅ Good - Uses immutable collections
$users = collect($users)
    ->push($newUser)
    ->sortBy('name')
    ->values();
```

**Frontend (React State):**

```tsx
// ❌ Bad - Direct mutation
formData.email = "new@example.com";
setFormData(formData);

items.push(newItem);
setItems(items);

// ✅ Good - Immutable updates
setFormData({ ...formData, email: "new@example.com" });

setItems([...items, newItem]);

// ✅ Good - Using map/filter
setItems(
    items.map((item) => (item.id === id ? { ...item, completed: true } : item))
);

setItems(items.filter((item) => item.id !== id));
```

### 4. No Divs as Buttons (MANDATORY)

Always use semantic HTML. Never use `<div>` with `onClick` for interactive elements.

**❌ Bad:**

```tsx
<div onClick={handleSubmit} className="btn btn-primary">
    Submit
</div>
```

**✅ Good:**

```tsx
<button onClick={handleSubmit} className="btn btn-primary">
    Submit
</button>

// For links that look like buttons
<a href="/dashboard" className="btn btn-primary">
    Go to Dashboard
</a>
```

### 5. No Console.log (MANDATORY)

Never use `console.log` in production code. Use proper logging.

**❌ Bad:**

```typescript
console.log("User data:", user);
console.log("Error:", error);
```

**✅ Good:**

```typescript
// For development only (remove before commit)
if (import.meta.env.DEV) {
    // Debug code here
}

// For actual error tracking
throw new Error(`Failed to load user: ${userId}`);

// Let error boundaries handle it
```

### 6. No Inline Styles (MANDATORY)

Always use Tailwind CSS classes, never inline styles.

**❌ Bad:**

```tsx
<div style={{ color: "red", padding: "10px", fontSize: "16px" }}>
    Error message
</div>
```

**✅ Good:**

```tsx
<div className="text-error p-4 text-base">Error message</div>
```

### 7. Eloquent Patterns for Queries (MANDATORY)

Always use Eloquent ORM, never raw SQL queries.

**❌ Bad:**

```php
DB::select('SELECT * FROM users WHERE email = ?', [$email]);
DB::statement('DELETE FROM logs WHERE created_at < ?', [$date]);
```

**✅ Good:**

```php
// Simple queries
User::where('email', $email)->first();

// Complex queries with relationships
User::with(['medications', 'caregivers'])
    ->whereHas('medications', fn($q) => $q->where('active', true))
    ->orderBy('name')
    ->get();

// Scopes
User::active()->verified()->paginate(15);

// Aggregates
Medication::where('user_id', $userId)->count();

// Batch operations
Medication::whereIn('id', $ids)->update(['active' => false]);
```

**Frontend:**

```typescript
// Define types/interfaces
interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

// Type everything
async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(
        "/api/v1/auth/login",
        credentials
    );
    return response.data;
}

// Component props
interface ButtonProps {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary";
    disabled?: boolean;
}

export function Button({
    label,
    onClick,
    variant = "primary",
    disabled = false,
}: ButtonProps): JSX.Element {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant}`}
        >
            {label}
        </button>
    );
}
```

### 9. Try-Catch Only for Batch Operations (MANDATORY)

Only use try-catch for batch operations. Let exceptions bubble to global handler otherwise.

**❌ Bad - Unnecessary try-catch:**

```php
public function create(Collection $data): Medication
{
    try {
        return Medication::create($data->toArray());
    } catch (\Exception $e) {
        throw new UnprocessableEntityException('Failed to create');
    }
}
```

**✅ Good - Let it bubble:**

```php
public function create(array $data): Medication
{
    // Validation
    if ($this->isDuplicate($data['name'])) {
        throw new UnprocessableEntityException(
            __('medications.duplicate'),
            'MEDICATION_DUPLICATE'
        );
    }

    // If this fails, let Laravel's exception handler catch it
    return Medication::create($data);
}
```

**✅ Good - Try-catch for batch:**

```php
/**
 * Import multiple medications from CSV.
 *
 * @param Collection<int, array<string, mixed>> $rows
 * @return array{success: int, failed: int, errors: array<int, string>}
 */
public function importBatch(Collection $rows): array
{
    $success = 0;
    $failed = 0;
    $errors = [];

    DB::transaction(function () use ($rows, &$success, &$failed, &$errors) {
        $rows->each(function ($row, $index) use (&$success, &$failed, &$errors) {
            try {
                $this->create($row);
                $success++;
            } catch (\Exception $e) {
                $failed++;
                $errors[$index] = $e->getMessage();

                // Log but continue processing
                logger()->error('Import failed', [
                    'row' => $index,
                    'error' => $e->getMessage(),
                ]);
            }
        });
    });

    return compact('success', 'failed', 'errors');
}
```

**Frontend:**

```typescript
// ❌ Bad - Catching everything
try {
    const user = await fetchUser();
    setUser(user);
} catch (error) {
    console.log("error"); // Don't do this
}

// ✅ Good - Let error boundaries handle it
const user = await fetchUser();
setUser(user);

// ✅ Good - Handle specific errors only
const handleLogin = async (credentials: LoginCredentials) => {
    try {
        const response = await axios.post("/api/v1/auth/login", credentials);
        saveAuthData(response.data);
        router.visit("/dashboard");
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 422) {
                setErrors(error.response.data.details);
            }
            // Let other errors propagate
        }
    }
};
```

### Frontend → Backend Integration

**1. TypeScript Types (Match Backend):**

```typescript
// resources/js/types/index.d.ts

export interface Medication {
    id: number;
    user_id: number;
    name: string;
    dosage: string;
    frequency: "daily" | "weekly" | "monthly";
    start_date: string;
    end_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateMedicationRequest {
    name: string;
    dosage: string;
    frequency: "daily" | "weekly" | "monthly";
    start_date: string;
    end_date?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
```

**2. Inertia Page Component:**

```tsx
import { route } from "@inertiajs/react";
import { useState } from "react";
import type { PageProps } from "@/types";
import { useToast } from "@/hooks/useToast";
import axios from "axios";

interface MedicationPageProps extends PageProps {
    medications: PaginatedResponse<Medication>;
}

export default function Medications({ medications }: MedicationPageProps) {
    const { showSuccess, showError } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleCreate = async (data: CreateMedicationRequest) => {
        setIsLoading(true);

        router.post(store.url(), data as any, {
            preserveScroll: true,
            onSuccess: () => {
                showSuccess("Medicamento criado com sucesso");
            },
            onError: () => {
                showError("Erro ao criar medicamento");
            },
            onFinish: () => {
                setIsLoading(false);
            },
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Medicamentos</h1>
            {/* Component content */}
        </div>
    );
}
```

## Review Checklist

Before submitting code, verify:

### Backend

-   [ ] All methods have return type declarations
-   [ ] All parameters have type declarations
-   [ ] Business logic is in Service classes, not Controllers
-   [ ] No `else` keywords - using early returns
-   [ ] Using Eloquent ORM, not raw SQL
-   [ ] Using Laravel Collections instead of arrays
-   [ ] Only using try-catch for batch operations
-   [ ] Using Laravel Wayfinder for routes
-   [ ] FormRequests for all input validation
-   [ ] PHPStan level 5 passes
-   [ ] Tests written for new features

### Frontend

-   [ ] TypeScript strict mode passes
-   [ ] All components have proper type definitions
-   [ ] No state mutation - using immutable updates
-   [ ] No divs used as buttons - semantic HTML
-   [ ] No console.log statements
-   [ ] No inline styles - Tailwind classes only
-   [ ] DaisyUI components used consistently
-   [ ] Responsive design tested
-   [ ] Accessibility: ARIA labels, keyboard navigation
-   [ ] Loading and error states handled
-   [ ] Tests written for components

### Integration

-   [ ] TypeScript types match backend models
-   [ ] Error handling consistent (422, 401, 500)
-   [ ] Flash messages converted to toasts
-   [ ] Authentication state checked properly
