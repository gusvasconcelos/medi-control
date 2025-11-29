---
name: frontend-development
description: Expert skill for React 19, TypeScript, Inertia.js, Tailwind CSS 4, and DaisyUI 5 development. Use when building UI components, pages, layouts, or frontend features for MediControl. Focuses on type-safety, accessibility, responsive design, and maintainable component patterns.
---

# Frontend Development Guidelines

Apply these standards to all React, TypeScript, Inertia.js, Tailwind CSS, and DaisyUI code in the MediControl project.

## Technology Stack

- React 19.2.0 (latest with modern hooks)
- TypeScript 5.9.3 (strict mode enabled)
- Inertia.js 2.2.18 (Laravel-React bridge)
- Tailwind CSS 4.0.0 (utility-first CSS)
- DaisyUI 5.5.5 (Tailwind component library)
- Vite 6.2.4 (build tool)
- Axios 1.8.2 (HTTP client)

## Project Structure

```
resources/js/
├── app.tsx                 # Inertia app entry point
├── bootstrap.ts            # Axios configuration
├── Components/             # Reusable UI components
│   ├── Auth/              # Authentication-specific components
│   ├── FlashMessages.tsx  # Server flash message handler
│   └── ToastContainer.tsx # Toast notification renderer
├── Layouts/               # Page layouts
│   └── AppLayout.tsx      # Main authenticated layout
├── Pages/                 # Inertia pages (route components)
│   ├── Auth/             # Authentication pages
│   ├── Dashboard.tsx     # Main dashboard
│   └── Welcome.tsx       # Landing page
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # JWT authentication hook
│   └── useToast.ts       # Toast notification hook
├── contexts/             # React Context providers
│   └── ToastContext.tsx  # Toast state management
└── types/                # TypeScript type definitions
    └── index.d.ts        # Shared types and interfaces
```

## Core Principles

### Type Safety

- Always define TypeScript interfaces for component props
- Use strict TypeScript configuration (no implicit any)
- Define types for all hooks, contexts, and utilities
- Use proper typing for Inertia page props via `PageProps<T>`
- Extend HTML element types when creating wrapper components

Example:
```tsx
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    // Implementation
  }
);
```

### Component Patterns

#### Shared Components
- Place reusable components in `Components/`
- Use domain-specific subdirectories (e.g., `Components/Auth/`)
- Export with named exports for better tree-shaking
- Use `forwardRef` for components that need DOM access

#### Page Components
- Place in `Pages/` directory following route structure
- Pages automatically receive layout via `app.tsx`
- Access server props via `PageProps<T>` type
- Handle form state locally with `useState`

#### Layout Components
- Place in `Layouts/` directory
- Wrap page content consistently
- Handle global UI elements (navbar, flash messages)
- Applied automatically in `app.tsx` resolver

### State Management

#### Local State
Use `useState` for component-local state:
```tsx
const [formData, setFormData] = useState<LoginCredentials>({
  email: '',
  password: '',
});
```

#### Context API
Use React Context for cross-cutting concerns:
```tsx
// Define context type
export interface ToastContextType {
  toasts: Toast[];
  showSuccess: (message: string, options?: ToastOptions) => void;
  showError: (message: string, options?: ToastOptions) => void;
  removeToast: (toastId: string) => void;
}

// Create provider
export function ToastProvider({ children }: { children: ReactNode }) {
  // Implementation
}

// Custom hook for consumption
export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
```

#### Custom Hooks
Create custom hooks for reusable logic:
- Place in `hooks/` directory
- Prefix with `use` (React convention)
- Return objects, not arrays (better readability)
- Include proper TypeScript types

Example:
```tsx
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = useMemo(() => !!user, [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    saveAuthData,
    getToken,
    logout,
  };
}
```

### Inertia.js Integration

#### Page Props
Define page props interface extending `PageProps`:
```tsx
import { PageProps } from '@/types';

export default function Dashboard({ auth }: PageProps) {
  const user = auth?.user;
  // Use user data
}
```

#### Navigation
Use Inertia router for navigation:
```tsx
import { router } from '@inertiajs/react';

// Visit route
router.visit('/dashboard');

// With data
router.post('/login', credentials);
```

#### Flash Messages
Server flash messages are handled automatically:
```tsx
// Backend sets flash message
return redirect('/dashboard')->with('success', 'Login successful');

// Frontend receives via PageProps
export type PageProps<T = Record<string, unknown>> = T & {
  flash?: {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
  };
};

// FlashMessages component converts to toasts
```

### Form Handling

#### Form State
```tsx
const [formData, setFormData] = useState<LoginCredentials>({
  email: '',
  password: '',
});

const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
const [isSubmitting, setIsSubmitting] = useState(false);
```

#### Form Submission
```tsx
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrors({});

  try {
    const response = await axios.post<AuthResponse>('/login', formData);
    saveAuthData(response.data);
    router.visit('/dashboard');
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 422) {
        // Validation errors
        setErrors(error.response.data.errors || {});
      } else if (error.response.status === 401) {
        setErrors({ email: 'Credenciais inválidas' });
      } else {
        showError('Erro ao fazer login');
      }
    }
  } finally {
    setIsSubmitting(false);
  }
};
```

#### Input Components
Use reusable input components with validation:
```tsx
<InputField
  label="Email"
  type="email"
  value={formData.email}
  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  error={errors.email}
  required
/>
```

### Error Handling

#### API Error Handling
- 422: Validation errors (map to form fields)
- 401: Authentication errors (show generic message)
- Other: Generic error with toast notification

#### Error Display
- Field-level errors via `InputField` error prop
- Toast notifications for global errors
- Loading states during async operations

## Design System

### MediControl Theme

#### Color Palette (Light Theme)
```css
--color-primary: oklch(64% 0.24 252);        /* Blue */
--color-secondary: oklch(65% 0.241 303);     /* Purple */
--color-accent: oklch(77% 0.152 70);         /* Yellow/Gold */
--color-neutral: oklch(35% 0.016 255);       /* Dark gray */
--color-base-100: oklch(100% 0 0);           /* Pure white */
--color-base-200: oklch(96% 0 0);            /* Light gray */
--color-base-300: oklch(92% 0 0);            /* Medium gray */
--color-info: oklch(70% 0.16 233);           /* Cyan */
--color-success: oklch(70% 0.177 163);       /* Green */
--color-warning: oklch(77% 0.152 70);        /* Yellow */
--color-error: oklch(65% 0.194 13);          /* Red */
```

#### Dark Theme
Dark mode is supported with `prefersdark: true` configuration. Colors are adjusted for dark backgrounds with base-100: `oklch(25% 0.016 255)`.

#### Typography
- Font Family: 'Instrument Sans' (via Google Fonts/Bunny CDN)
- Fallback: ui-sans-serif, system-ui, sans-serif
- Use semantic text sizes: `text-sm`, `text-base`, `text-lg`, `text-xl`

#### Spacing
- Use consistent spacing scale: `p-4`, `gap-4`, `space-y-4`
- Mobile: `p-4`, Desktop: `lg:p-8`
- Container max-width: `max-w-md`, `max-w-4xl`, `max-w-7xl`

#### Border Radius
```css
--rounded-box: 1rem;          /* Cards, containers */
--rounded-btn: 0.5rem;        /* Buttons */
--rounded-badge: 1.9rem;      /* Badges, pills */
```

### DaisyUI Components

#### Common Components
Use DaisyUI component classes for consistent UI:

**Buttons:**
```tsx
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-outline">Outline</button>
```

**Loading State:**
```tsx
<button className="btn btn-primary" disabled={isLoading}>
  {isLoading ? (
    <>
      <span className="loading loading-spinner"></span>
      Carregando...
    </>
  ) : (
    'Enviar'
  )}
</button>
```

**Forms:**
```tsx
<div className="form-control w-full">
  <label className="label">
    <span className="label-text">Email</span>
  </label>
  <input
    type="text"
    className="input input-bordered w-full"
  />
  <label className="label">
    <span className="label-text-alt text-error">Error message</span>
  </label>
</div>
```

**Cards:**
```tsx
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
    <p>Card content</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>
```

**Navbar:**
```tsx
<nav className="navbar bg-base-100 border-b border-base-300">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">MediControl</a>
  </div>
  <div className="flex-none">
    <div className="dropdown dropdown-end">
      <button className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full bg-primary text-primary-content">
          <span>AV</span>
        </div>
      </button>
      <ul className="menu dropdown-content">
        <li><a>Profile</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</nav>
```

**Alerts/Toasts:**
```tsx
<div className="toast toast-bottom toast-center">
  <div className="alert alert-success">
    <svg>...</svg>
    <span>Success message</span>
  </div>
</div>
```

**Hero:**
```tsx
<div className="hero min-h-screen bg-base-200">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">Hello there</h1>
      <p className="py-6">Provident cupiditate...</p>
      <button className="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>
```

**Dropdown:**
```tsx
<div className="dropdown dropdown-end">
  <button tabIndex={0} className="btn">Click</button>
  <ul tabIndex={0} className="dropdown-content menu">
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</div>
```

#### Component Modifiers
- Size: `btn-sm`, `btn-md`, `btn-lg`
- Width: `w-full`, `btn-wide`, `btn-block`
- State: `btn-disabled`, `loading`, `btn-active`
- Color: `btn-primary`, `btn-error`, `btn-success`

### Tailwind Utilities

#### Responsive Design
Use mobile-first approach:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

Common breakpoints:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

#### Layout
```tsx
// Flexbox
<div className="flex items-center justify-between gap-4">

// Grid
<div className="grid grid-cols-3 gap-8">

// Spacing
<div className="p-4 m-2 space-y-4">

// Sizing
<div className="w-full max-w-md min-h-screen">
```

#### Typography
```tsx
<h1 className="text-3xl font-bold text-base-content">
<p className="text-sm text-base-content/70">
```

#### States
```tsx
<button className="hover:bg-primary-focus active:scale-95 disabled:opacity-50">
```

### Class Organization
Order classes for readability:
1. Layout (flex, grid, display)
2. Positioning (absolute, relative)
3. Sizing (w-*, h-*)
4. Spacing (p-*, m-*, gap-*)
5. Typography (text-*, font-*)
6. Colors (bg-*, text-*)
7. DaisyUI component classes (btn, card, etc.)
8. States (hover:, focus:, disabled:)
9. Responsive (md:, lg:)

Example:
```tsx
<button className="flex items-center gap-2 px-4 py-2 text-sm font-medium btn btn-primary hover:btn-primary-focus disabled:opacity-50 md:px-6">
```

## Accessibility

### Semantic HTML
Use proper HTML elements:
```tsx
<nav>        // Navigation
<main>       // Main content
<header>     // Page header
<footer>     // Page footer
<article>    // Independent content
<section>    // Thematic grouping
<button>     // Interactive action (not <div> with onClick)
<a>          // Navigation link
```

### ARIA Attributes
Add ARIA labels when needed:
```tsx
<button aria-label="Close notification">
  <svg>...</svg>
</button>

<div role="alert" aria-live="polite">
  Notification message
</div>
```

### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Use proper `tabIndex` for custom components
- Test with Tab, Enter, Escape keys

### Form Accessibility
- Associate labels with inputs
- Provide error messages linked to fields
- Use proper input types (email, password, tel)
- Add required and aria-required attributes

Example:
```tsx
<label htmlFor="email" className="label">
  <span className="label-text">Email</span>
</label>
<input
  id="email"
  type="email"
  required
  aria-required="true"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
  className="input input-bordered"
/>
{errors.email && (
  <span id="email-error" className="label-text-alt text-error">
    {errors.error}
  </span>
)}
```

## Performance

### Component Optimization

#### Memoization
Use `useMemo` for expensive calculations:
```tsx
const isAuthenticated = useMemo(() => !!user && !!token, [user, token]);
```

Use `useCallback` for callback props:
```tsx
const handleRemove = useCallback((id: string) => {
  removeToast(id);
}, [removeToast]);
```

Use `React.memo` for pure components:
```tsx
export const InputField = memo(forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, ...props }, ref) => {
    // Implementation
  }
));
```

#### Lazy Loading
Use dynamic imports for code splitting:
```tsx
const Dashboard = lazy(() => import('./Pages/Dashboard'));
```

### Asset Optimization
- Use WebP/AVIF for images
- Lazy load images below the fold
- Optimize SVG files
- Use proper image dimensions

## Testing Patterns

### Component Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';

describe('InputField', () => {
  it('displays error message when error prop is provided', () => {
    render(<InputField label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const handleChange = vi.fn();
    render(<InputField label="Email" onChange={handleChange} />);

    const input = screen.getByLabelText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(handleChange).toHaveBeenCalled();
  });
});
```

### Hook Testing
```tsx
import { renderHook, act } from '@testing-library/react';

describe('useToast', () => {
  it('adds toast notification', () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.showSuccess('Success message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Success message');
  });
});
```

## Code Organization

### File Naming
- Components: PascalCase (e.g., `InputField.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Contexts: PascalCase with `Context` suffix (e.g., `ToastContext.tsx`)
- Pages: PascalCase (e.g., `Dashboard.tsx`)
- Types: camelCase (e.g., `index.d.ts`)

### Import Organization
Order imports:
1. React and third-party libraries
2. Inertia imports
3. Components (@ alias)
4. Hooks (@ alias)
5. Contexts (@ alias)
6. Types (@ alias)
7. Styles

Example:
```tsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

import { InputField } from '@/Components/Auth/InputField';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { PageProps, LoginCredentials } from '@/types';
```

### Export Patterns
- Use named exports for components (better tree-shaking)
- Export types alongside components
- Avoid default exports except for pages

```tsx
// ✅ Good
export function InputField({ label, ...props }: InputFieldProps) {
  // Implementation
}

export interface InputFieldProps {
  label: string;
  error?: string;
}

// ❌ Avoid (except pages)
export default InputField;
```

## Authentication

### JWT Token Management
```tsx
const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRES_KEY = 'auth_token_expires_at';

// Save token
function saveAuthData(authResponse: AuthResponse) {
  const expiresAt = new Date(Date.now() + authResponse.expires_in * 1000);
  localStorage.setItem(TOKEN_KEY, authResponse.access_token);
  localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toISOString());
}

// Check if token is valid
function isTokenValid(): boolean {
  const expiresAt = localStorage.getItem(TOKEN_EXPIRES_KEY);
  if (!expiresAt) return false;
  return new Date(expiresAt) > new Date();
}

// Set Axios default header
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Protected Routes
Inertia middleware handles authentication. On frontend, check auth state:
```tsx
export default function Dashboard({ auth }: PageProps) {
  if (!auth?.user) {
    router.visit('/login');
    return null;
  }

  return <div>Dashboard content</div>;
}
```

## API Integration

### Axios Configuration
Configure in `bootstrap.ts`:
```tsx
import axios from 'axios';

window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
```

### API Calls
```tsx
// POST request
const response = await axios.post<AuthResponse>('/api/v1/auth/login', {
  email: 'user@example.com',
  password: 'password123',
});

// GET request with auth
const user = await axios.get<User>('/api/v1/auth/me');

// Error handling
try {
  await axios.post('/api/endpoint', data);
} catch (error) {
  if (axios.isAxiosError(error) && error.response) {
    // Handle error response
    console.error(error.response.data);
  }
}
```

## Notification System

### Toast Context Usage
```tsx
import { useToast } from '@/hooks/useToast';

export default function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleAction = async () => {
    try {
      await performAction();
      showSuccess('Ação realizada com sucesso');
    } catch (error) {
      showError('Erro ao realizar ação');
    }
  };

  return <button onClick={handleAction}>Executar</button>;
}
```

### Toast Options
```tsx
showSuccess('Mensagem', {
  duration: 5000,  // Custom duration in ms
});

// Default durations by type:
// - success/info: 5000ms
// - warning/error: 7000ms
```

## Common Patterns

### Loading States
```tsx
const [isLoading, setIsLoading] = useState(false);

{isLoading ? (
  <div className="flex justify-center items-center">
    <span className="loading loading-spinner loading-lg"></span>
  </div>
) : (
  <div>Content</div>
)}
```

### Conditional Rendering
```tsx
// ✅ Good - Early return
if (!user) {
  return <div>Please log in</div>;
}

return <div>Welcome, {user.name}</div>;

// ❌ Avoid - Nested ternaries
{user ? (
  <div>Welcome, {user.name}</div>
) : (
  <div>Please log in</div>
)}
```

### List Rendering
```tsx
{items.map((item) => (
  <div key={item.id} className="card">
    <h3>{item.title}</h3>
  </div>
))}
```

### User Initials
```tsx
function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
```

### Event Handlers
```tsx
// Form submission
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  // Handle form
};

// Input change
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

// Button click
const handleClick = () => {
  // Handle action
};
```

## Anti-Patterns to Avoid

### Don't Use Inline Styles
```tsx
// ❌ Bad
<div style={{ color: 'red', padding: '10px' }}>

// ✅ Good
<div className="text-error p-4">
```

### Don't Use Index as Key
```tsx
// ❌ Bad
{items.map((item, index) => <div key={index}>{item}</div>)}

// ✅ Good
{items.map((item) => <div key={item.id}>{item}</div>)}
```

### Don't Mutate State Directly
```tsx
// ❌ Bad
formData.email = 'new@example.com';
setFormData(formData);

// ✅ Good
setFormData({ ...formData, email: 'new@example.com' });
```

### Don't Use Divs for Buttons
```tsx
// ❌ Bad
<div onClick={handleClick}>Click me</div>

// ✅ Good
<button onClick={handleClick}>Click me</button>
```

### Don't Forget Dependencies
```tsx
// ❌ Bad
useEffect(() => {
  fetchData(userId);
}, []); // Missing userId dependency

// ✅ Good
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

## Review Checklist

Before submitting frontend code:
- [ ] TypeScript strict mode passes with no errors
- [ ] All components have proper type definitions
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Accessibility: semantic HTML, ARIA labels, keyboard navigation
- [ ] Loading and error states handled
- [ ] Form validation and error messages implemented
- [ ] DaisyUI components used consistently
- [ ] Tailwind classes organized properly
- [ ] No inline styles
- [ ] No console.log statements
- [ ] Images optimized
- [ ] Code follows component patterns documented here
- [ ] Custom hooks for reusable logic
- [ ] Proper error handling with toasts
- [ ] Authentication state checked where needed
