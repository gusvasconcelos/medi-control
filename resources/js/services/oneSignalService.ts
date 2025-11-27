import axios from 'axios';
import type { OneSignalRegisterData, OneSignalRegisterResponse, OneSignalDevicesResponse, DeviceType } from '@/types';

const API_BASE = '/api/v1';

export const oneSignalService = {
    async registerPlayerId(
        playerId: string,
        deviceType?: DeviceType,
        browser?: string,
        os?: string,
        deviceName?: string
    ): Promise<OneSignalRegisterResponse> {
        const response = await axios.post<OneSignalRegisterResponse>(
            `${API_BASE}/onesignal/register`,
            {
                player_id: playerId,
                device_type: deviceType,
                browser,
                os,
                device_name: deviceName,
            } as OneSignalRegisterData
        );
        return response.data;
    },

    async unregisterPlayerId(playerId: string): Promise<{ message: string }> {
        const response = await axios.post<{ message: string }>(
            `${API_BASE}/onesignal/unregister`,
            { player_id: playerId }
        );
        return response.data;
    },

    async getDevices(): Promise<OneSignalDevicesResponse> {
        const response = await axios.get<OneSignalDevicesResponse>(
            `${API_BASE}/onesignal/devices`
        );
        return response.data;
    },
};
