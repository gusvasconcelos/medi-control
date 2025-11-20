import axios from 'axios';
import type {
    UserMedicationsResponse,
    IndicatorsResponse,
} from '@/types';

export const medicationService = {
    async getUserMedications(date: string): Promise<UserMedicationsResponse> {
        const response = await axios.get<UserMedicationsResponse>(
            '/api/v1/user-medications',
            {
                params: {
                    start_date: date,
                    end_date: date,
                },
            }
        );
        return response.data;
    },

    async getIndicators(date: string): Promise<IndicatorsResponse> {
        const response = await axios.get<IndicatorsResponse>(
            '/api/v1/user-medications/indicators',
            {
                params: {
                    start_date: date,
                    end_date: date,
                },
            }
        );
        return response.data;
    },

    async logMedicationTaken(medicationId: number): Promise<void> {
        await axios.post(
            `/api/v1/user-medications/${medicationId}/log-taken`
        );
    },

    async getMedicationDetails(medicationId: number) {
        const response = await axios.get(
            `/api/v1/user-medications/${medicationId}`
        );
        return response.data;
    },
};
