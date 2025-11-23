import axios from 'axios';
import type {
    Notification,
    NotificationPreference,
    NotificationPreferenceResponse,
    NotificationsResponse,
    UnreadCountResponse,
    UpdateNotificationPreferenceData,
} from '@/types';

const API_BASE = '/api/v1';

export const notificationService = {
    async getNotifications(params?: {
        page?: number;
        per_page?: number;
        type?: string;
        status?: string;
    }): Promise<NotificationsResponse> {
        const response = await axios.get<NotificationsResponse>(`${API_BASE}/notifications`, {
            params,
        });
        return response.data;
    },

    async getUnreadCount(): Promise<number> {
        const response = await axios.get<UnreadCountResponse>(`${API_BASE}/notifications/unread-count`);
        return response.data.data.count;
    },

    async getRecent(): Promise<Notification[]> {
        const response = await axios.get<{ data: Notification[] }>(`${API_BASE}/notifications/recent`);
        return response.data.data;
    },

    async markAsRead(id: number): Promise<Notification> {
        const response = await axios.patch<{ data: Notification }>(`${API_BASE}/notifications/${id}/read`);
        return response.data.data;
    },

    async markAllAsRead(): Promise<void> {
        await axios.patch(`${API_BASE}/notifications/mark-all-read`);
    },

    async getPreferences(): Promise<NotificationPreference> {
        const response = await axios.get<NotificationPreferenceResponse>(`${API_BASE}/notification-preferences`);
        return response.data.data;
    },

    async updatePreferences(data: UpdateNotificationPreferenceData): Promise<NotificationPreference> {
        const response = await axios.put<NotificationPreferenceResponse>(`${API_BASE}/notification-preferences`, data);
        return response.data.data;
    },
};
