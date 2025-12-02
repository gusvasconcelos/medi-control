import type { User } from './index.d';
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
