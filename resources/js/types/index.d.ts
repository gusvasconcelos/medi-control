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
    onesignal_player_id?: string | null;
    profile_photo_path?: string;
    profile_photo_url?: string;
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
    remember?: boolean;
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
export interface MedicationInteraction {
    medication_id: number;
    medication_name?: string;
    has_interaction: boolean;
    severity: string;
    description: string;
    calculated_at: string;
}

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
    interactions?: MedicationInteraction[] | null;
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

/**
 * Adherence Report
 */
export type InteractionSeverity = 'mild' | 'moderate' | 'severe' | 'contraindicated';

export interface MedicationInteraction {
    id: number;
    name: string;
    severity: InteractionSeverity;
}

export interface MedicationAdherenceReport {
    id: number;
    name: string;
    dosage: string;
    time_slots: string[];
    total_scheduled: number;
    total_taken: number;
    total_lost: number;
    total_pending: number;
    punctuality_rate: number;
    interactions: MedicationInteraction[];
}

export interface AdherenceReportData {
    adherence_rate: number;
    total_taken: number;
    total_lost: number;
    total_pending: number;
    punctuality_rate: number;
    medications: MedicationAdherenceReport[];
}

export interface AdherenceReportResponse {
    data: AdherenceReportData;
}

export type ReportPeriod = 'week' | 'month' | 'quarter' | 'semester' | 'year';

/**
 * Notifications
 */
export type NotificationType = 'medication_reminder' | 'low_stock' | 'interaction_alert' | 'system';
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'read';
export type NotificationProvider = 'push' | 'whatsapp';

export interface Notification {
    id: number;
    user_id: number;
    user_medication_id?: number | null;
    type: NotificationType;
    title: string;
    body: string;
    scheduled_for: string;
    sent_at?: string | null;
    read_at?: string | null;
    provider: NotificationProvider;
    status: NotificationStatus;
    metadata?: Record<string, unknown> | null;
    created_at?: string;
}

export interface NotificationPreference {
    id: number;
    user_id: number;
    medication_reminder: boolean;
    low_stock_alert: boolean;
    interaction_alert: boolean;
    push_enabled: boolean;
    whatsapp_enabled: boolean;
    quiet_hours_start?: string | null;
    quiet_hours_end?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface UpdateNotificationPreferenceData {
    medication_reminder?: boolean;
    low_stock_alert?: boolean;
    interaction_alert?: boolean;
    push_enabled?: boolean;
    whatsapp_enabled?: boolean;
    quiet_hours_start?: string | null;
    quiet_hours_end?: string | null;
}

export interface NotificationPreferenceResponse {
    data: NotificationPreference;
    message?: string;
}

export interface NotificationsResponse {
    data: Notification[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export interface UnreadCountResponse {
    data: {
        count: number;
    };
}

/**
 * OneSignal
 */
export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface UserDevice {
    id: number;
    device_type?: DeviceType | null;
    browser?: string | null;
    os?: string | null;
    device_name?: string | null;
    last_seen_at?: string | null;
    active: boolean;
    created_at: string;
}

export interface OneSignalRegisterData {
    player_id: string;
    device_type?: DeviceType;
    browser?: string;
    os?: string;
    device_name?: string;
}

export interface OneSignalRegisterResponse {
    message: string;
    device: {
        id: number;
        player_id: string;
        device_type?: DeviceType | null;
        browser?: string | null;
        os?: string | null;
        device_name?: string | null;
    };
}

export interface OneSignalDevicesResponse {
    data: UserDevice[];
}

declare global {
    interface Window {
        axios: typeof import('axios').default;
        Pusher: typeof import('pusher-js').default;
        Echo: import('laravel-echo').default;
        OneSignalDeferred?: Array<() => void>;
        OneSignal?: {
            init(options: {
                appId: string;
                allowLocalhostAsSecureOrigin?: boolean;
                [key: string]: unknown;
            }): Promise<void>;
            User: {
                PushSubscription: {
                    id?: string;
                    token?: string;
                    optedIn?: boolean;
                };
            };
            Notifications: {
                requestPermission(): Promise<void>;
                permission: boolean;
            };
            on(event: string, callback: (event: unknown) => void): void;
        };
    }

    function route<T = string>(
        name: string,
        params?: Record<string, unknown> | unknown[],
        absolute?: boolean
    ): T;
}
