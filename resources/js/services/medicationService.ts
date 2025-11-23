/**
 * Medication API Service
 *
 * Handles all medication-related API calls including user medications,
 * medication search, indicators, and logging.
 */

import axios from 'axios';
import type {
    CreateUserMedicationData,
    IndicatorsResponse,
    MedicationSearchResponse,
    UserMedication,
    UserMedicationsResponse,
} from '@/types';

const API_BASE = '/api/v1';

export const medicationService = {
    /**
     * Get user medications for a specific date
     */
    async getUserMedications(date: string): Promise<UserMedicationsResponse> {
        const response = await axios.get<UserMedicationsResponse>(
            `${API_BASE}/user-medications`,
            {
                params: {
                    start_date: date,
                    end_date: date,
                },
            }
        );
        return response.data;
    },

    /**
     * Get medication adherence indicators for a date
     */
    async getIndicators(date: string): Promise<IndicatorsResponse> {
        const response = await axios.get<IndicatorsResponse>(
            `${API_BASE}/user-medications/indicators`,
            {
                params: {
                    start_date: date,
                    end_date: date,
                },
            }
        );
        return response.data;
    },

    /**
     * Log a medication as taken
     */
    async logMedicationTaken(
        medicationId: number,
        data?: { taken_at?: string; notes?: string }
    ): Promise<void> {
        await axios.post(
            `${API_BASE}/user-medications/${medicationId}/log-taken`,
            data
        );
    },

    /**
     * Get detailed information for a specific medication
     */
    async getMedicationDetails(
        medicationId: number
    ): Promise<UserMedication> {
        const response = await axios.get<UserMedication>(
            `${API_BASE}/user-medications/${medicationId}`
        );
        return response.data;
    },

    /**
     * Search medications by name or active principle
     */
    async searchMedications(
        query: string,
        limit = 10
    ): Promise<MedicationSearchResponse> {
        const response = await axios.get<MedicationSearchResponse>(
            `${API_BASE}/medications/search`,
            {
                params: {
                    search: query,
                    limit,
                },
            }
        );
        return response.data;
    },

    /**
     * Create a new user medication
     */
    async createUserMedication(
        data: CreateUserMedicationData
    ): Promise<UserMedication> {
        const response = await axios.post<UserMedication>(
            `${API_BASE}/user-medications`,
            data
        );
        return response.data;
    },

    /**
     * Get paginated list of medications
     */
    async getMedications(params?: {
        page?: number;
        per_page?: number;
        search?: string;
    }): Promise<{
        data: Medication[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    }> {
        const queryParams: Record<string, string | number> = {};

        if (params?.page) {
            queryParams.page = params.page;
        }

        if (params?.per_page) {
            queryParams.per_page = params.per_page;
        }

        if (params?.search && params.search.trim() !== '') {
            queryParams.q = JSON.stringify({ text: params.search });
        }

        const response = await axios.get(`${API_BASE}/medications`, {
            params: queryParams,
        });
        return response.data;
    },

    /**
     * Get a single medication by ID
     */
    async getMedication(id: number): Promise<Medication> {
        const response = await axios.get<{ data: Medication }>(
            `${API_BASE}/medications/${id}`
        );
        return response.data.data;
    },

    /**
     * Create a new medication
     */
    async createMedication(
        data: Omit<Medication, 'id'>
    ): Promise<Medication> {
        const response = await axios.post<{ data: Medication }>(
            `${API_BASE}/medications`,
            data
        );
        return response.data.data;
    },

    /**
     * Update an existing medication
     */
    async updateMedication(
        id: number,
        data: Partial<Omit<Medication, 'id'>>
    ): Promise<Medication> {
        const response = await axios.put<{ data: Medication }>(
            `${API_BASE}/medications/${id}`,
            data
        );
        return response.data.data;
    },

    /**
     * Delete a medication
     */
    async deleteMedication(id: number): Promise<void> {
        await axios.delete(`${API_BASE}/medications/${id}`);
    },
};
