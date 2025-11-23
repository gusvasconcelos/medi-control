import axios from 'axios';
import type {
    CaregiverPatient,
    CaregiverPatientListResponse,
    CaregiverPermissionsResponse,
    InviteCaregiverData,
    PendingInvitationsResponse,
    UpdatePermissionsData,
} from '@/types/caregiver';

const API_BASE = '/api/v1';

export const caregiverPatientService = {
    async getMyCaregivers(params?: {
        page?: number;
        per_page?: number;
        all?: boolean;
    }): Promise<CaregiverPatientListResponse> {
        const queryParams: Record<string, string | number> = {};

        if (params?.all) {
            queryParams.all = 'true';
        }

        if (params?.page) {
            queryParams.page = params.page;
        }

        if (params?.per_page) {
            queryParams.per_page = params.per_page;
        }

        const response = await axios.get(`${API_BASE}/my-caregivers`, {
            params: queryParams,
        });
        return response.data;
    },

    async getMyPatients(params?: {
        page?: number;
        per_page?: number;
        all?: boolean;
    }): Promise<CaregiverPatientListResponse> {
        const queryParams: Record<string, string | number> = {};

        if (params?.all) {
            queryParams.all = 'true';
        }

        if (params?.page) {
            queryParams.page = params.page;
        }

        if (params?.per_page) {
            queryParams.per_page = params.per_page;
        }

        const response = await axios.get(`${API_BASE}/my-patients`, {
            params: queryParams,
        });
        return response.data;
    },

    async getPendingInvitations(): Promise<PendingInvitationsResponse> {
        const response = await axios.get(`${API_BASE}/my-patients/pending`);
        return response.data;
    },

    async inviteCaregiver(data: InviteCaregiverData): Promise<{ message: string; data: CaregiverPatient }> {
        const response = await axios.post(`${API_BASE}/my-caregivers/invite`, data);
        return response.data;
    },

    async acceptInvitation(id: number): Promise<{ message: string; data: CaregiverPatient }> {
        const response = await axios.post(`${API_BASE}/my-patients/${id}/accept`);
        return response.data;
    },

    async rejectInvitation(id: number): Promise<{ message: string }> {
        const response = await axios.delete(`${API_BASE}/my-patients/${id}/reject`);
        return response.data;
    },

    async revokeAccess(id: number): Promise<{ message: string }> {
        const response = await axios.delete(`${API_BASE}/my-caregivers/${id}/revoke`);
        return response.data;
    },

    async cancelInvitation(id: number): Promise<{ message: string }> {
        const response = await axios.delete(`${API_BASE}/my-caregivers/${id}/cancel`);
        return response.data;
    },

    async updatePermissions(
        id: number,
        data: UpdatePermissionsData
    ): Promise<{ message: string; data: CaregiverPatient }> {
        const response = await axios.put(`${API_BASE}/my-caregivers/${id}/permissions`, data);
        return response.data;
    },

    async getCaregiverPermissions(): Promise<CaregiverPermissionsResponse> {
        const response = await axios.get(`${API_BASE}/caregiver-permissions`);
        return response.data;
    },

    async getRelationship(id: number): Promise<{ data: CaregiverPatient }> {
        const response = await axios.get(`${API_BASE}/caregiver-patient/${id}`);
        return response.data;
    },
};
