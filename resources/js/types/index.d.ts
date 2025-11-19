export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    email_verified_at?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    email: string;
    password: string;
    password_confirmation: string;
    token: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth?: {
        user: User;
    };
};

declare global {
    interface Window {
        axios: typeof import('axios').default;
    }
}
