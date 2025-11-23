/**
 * Role
 */
export interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
}

/**
 * User
 */
export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    email_verified_at?: string;
    roles?: Role[];
    created_at: string;
    updated_at: string;
}

/**
 * Authentication
 */
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

/**
 * Inertia Page Props
 */
export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth?: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
};

/**
 * Toast Notifications
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

export interface ToastOptions {
    duration?: number;
}

export interface ToastContextType {
    toasts: Toast[];
    showSuccess: (message: string, options?: ToastOptions) => void;
    showError: (message: string, options?: ToastOptions) => void;
    showWarning: (message: string, options?: ToastOptions) => void;
    showInfo: (message: string, options?: ToastOptions) => void;
    removeToast: (toastId: string) => void;
}

/**
 * Medications
 */
export interface Medication {
    id: number;
    name: string;
    active_principle?: string | null;
    manufacturer?: string | null;
    category?: string | null;
    therapeutic_class?: string | null;
    registration_number?: string | null;
    strength?: string | null;
    form?: string | null;
    description?: string | null;
    warnings?: string | null;
    interactions?: string[] | null;
}

export interface MedicationSearchResult {
    id: number;
    name: string;
    active_principle?: string | null;
    manufacturer?: string | null;
    category?: string | null;
    therapeutic_class?: string | null;
    strength?: string | null;
    form?: string | null;
    description?: string | null;
}

export interface MedicationSearchResponse {
    data: MedicationSearchResult[];
}

/**
 * User Medications
 */
export type ViaAdministration =
    | 'oral'
    | 'topical'
    | 'injection'
    | 'inhalation'
    | 'sublingual'
    | 'rectal'
    | 'other';

export type MedicationLogStatus =
    | 'pending'
    | 'taken'
    | 'missed'
    | 'skipped';

export interface MedicationLog {
    id: number;
    user_medication_id: number;
    scheduled_at: string;
    taken_at?: string | null;
    status: MedicationLogStatus;
    notes?: string | null;
    created_at: string;
}

export interface UserMedication {
    id: number;
    user_id: number;
    medication_id: number;
    dosage: string;
    time_slots: string[];
    via_administration: ViaAdministration;
    start_date: string;
    end_date?: string | null;
    initial_stock: number;
    current_stock: number;
    low_stock_threshold: number;
    notes?: string | null;
    active: boolean;
    created_at: string;
    updated_at: string;
    medication?: Medication;
    logs?: MedicationLog[];
}

export interface CreateUserMedicationData {
    medication_id: number;
    dosage: string;
    time_slots: string[];
    via_administration: ViaAdministration;
    start_date: string;
    end_date?: string;
    initial_stock: number;
    current_stock: number;
    low_stock_threshold: number;
    notes?: string;
}

/**
 * API Responses
 */
export interface UserMedicationsResponse {
    data: UserMedication[];
}

export interface IndicatorData {
    date: string;
    total_scheduled: number;
    total_taken: number;
}

export interface IndicatorsResponse {
    data: IndicatorData[];
}

export interface DailyMetrics {
    totalMedications: number;
    medicationsTaken: number;
    medicationsPending: number;
    adherencePercentage: number;
}

/**
 * Metrics Overview
 */
export interface TopMedication {
    id: number;
    name: string;
    usage_count: number;
}

export interface MetricsOverviewData {
    uptime: {
        started_at: string;
        uptime_seconds: number;
        uptime_human: string;
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    };
    cpu: {
        load_average: number;
        cores: number;
        percentage: number;
    };
    memory: {
        used_mb: number;
        total_mb: number;
        percentage: number;
    };
    disk: number;
    total_medications: number;
    total_users: number;
    total_active_medications: number;
    top_medications: TopMedication[];
}

declare global {
    interface Window {
        axios: typeof import('axios').default;
    }
}
