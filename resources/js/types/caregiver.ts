import type { User, UserMedication, MedicationLog, Medication, PageProps, ViaAdministration, MedicationLogStatus } from './index.d';
import type { Permission } from './permissions';

export type CaregiverPatientStatus = 'pending' | 'active' | 'revoked';

export interface CaregiverPatient {
    id: number;
    caregiver_id: number | null;
    patient_id: number;
    status: CaregiverPatientStatus;
    invited_at: string;
    accepted_at: string | null;
    revoked_at: string | null;
    created_at: string;
    updated_at: string;
    caregiver?: User;
    patient?: User;
    permissions?: Permission[];
}

export interface InviteCaregiverData {
    email: string;
    permissions?: number[];
}

export interface UpdatePermissionsData {
    permissions: number[];
}

export interface CaregiverPatientListResponse {
    data: CaregiverPatient[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export interface PendingInvitationsResponse {
    data: CaregiverPatient[];
}

export interface CaregiverPermissionsResponse {
    data: Permission[];
}

export interface CaregiverActionPermissions {
    medications: {
        canView: boolean;
        canCreate: boolean;
        canEdit: boolean;
        canDelete: boolean;
    };
    adherence: {
        canView: boolean;
        canMark: boolean;
    };
    profile: {
        canView: boolean;
    };
}

export interface PatientDetailData {
    patient: User;
    relationship: CaregiverPatient;
    permissions: Permission[];
    availableActions: CaregiverActionPermissions;
}

/**
 * Patient Medications
 */
export interface PatientMedicationData extends UserMedication {
    medication?: Medication;
}

export interface AddPatientMedicationData {
    medication_id: number;
    dosage: string;
    time_slots: string[];
    via_administration: ViaAdministration;
    start_date: string;
    end_date?: string;
    initial_stock: number;
    low_stock_threshold: number;
}

export interface UpdatePatientMedicationData {
    medication_id: number;
    dosage: string;
    time_slots: string[];
    via_administration: ViaAdministration;
    start_date: string;
    end_date?: string;
    initial_stock: number;
    current_stock: number;
    low_stock_threshold: number;
}

/**
 * Patient Adherence
 */
export interface PatientAdherenceLog extends MedicationLog {
    userMedication?: {
        id: number;
        medication?: Medication;
    };
}

export interface MarkAdherenceData {
    status: MedicationLogStatus;
    taken_at?: string;
    notes?: string;
}

export interface PatientAdherenceFilters {
    start_date: string;
    end_date: string;
    status?: MedicationLogStatus;
    medication_id?: number;
}

export interface SimplifiedMedication {
    id: number;
    name: string;
}

/**
 * Patient Profile
 */
export interface PatientProfile extends User {
    medications_count?: number;
}

export interface PatientAdherenceStats {
    adherence_rate: number;
    punctuality_rate: number;
    total_scheduled: number;
    total_taken: number;
    total_missed: number;
    total_skipped: number;
    total_pending: number;
    period_start: string;
    period_end: string;
}

export interface ActiveMedicationSummary {
    id: number;
    medication_name: string;
    dosage: string;
    time_slots: string[];
    via_administration: ViaAdministration;
    start_date: string;
    end_date?: string;
}

/**
 * Inertia Page Props
 */
export interface PaginatedMedications {
    data: Medication[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

export interface PatientMedicationsPageProps extends PageProps {
    patient: User;
    medications: PatientMedicationData[];
    availableActions: CaregiverActionPermissions;
    availableMedications: PaginatedMedications;
}

export interface PatientMedicationFormPageProps extends PageProps {
    patient: User;
    medication?: PatientMedicationData;
    availableMedications: Medication[];
}

export interface PatientAdherencePageProps extends PageProps {
    patient: User;
    logs: {
        data: PatientAdherenceLog[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    availableActions: CaregiverActionPermissions;
    filters: PatientAdherenceFilters;
    patientMedications: SimplifiedMedication[];
}

export interface PatientProfilePageProps extends PageProps {
    patient: User;
    adherenceStats: PatientAdherenceStats;
    activeMedications: ActiveMedicationSummary[];
    availableActions: CaregiverActionPermissions;
}
