/**
 * User API Service
 *
 * Handles all user-related API calls
 */

import axios from 'axios';
import type { User } from '@/types';

const API_BASE = '/api/v1';

export const userService = {
    /**
     * Get paginated list of users
     */
    async getUsers(params?: {
        page?: number;
        per_page?: number;
        search?: string;
    }): Promise<{
        data: User[];
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

        const response = await axios.get(`${API_BASE}/users`, {
            params: queryParams,
        });
        return response.data;
    },

    /**
     * Get a single user by ID
     */
    async getUser(id: number): Promise<User> {
        const response = await axios.get<User>(
            `${API_BASE}/users/${id}`
        );
        return response.data;
    },

    /**
     * Update user roles
     */
    async updateUserRoles(userId: number, roleIds: number[]): Promise<User> {
        const response = await axios.put<{ data: User }>(
            `${API_BASE}/users/${userId}/roles`,
            { roles: roleIds }
        );
        return response.data.data;
    },

    /**
     * Get current user profile
     */
    async getProfile(): Promise<User> {
        const response = await axios.get<{ data: User }>(
            `${API_BASE}/users/me/profile`
        );
        return response.data.data;
    },

    /**
     * Update current user profile
     */
    async updateProfile(data: {
        name: string;
        email: string;
        phone?: string;
        profile_photo_path?: string;
    }): Promise<User> {
        const response = await axios.put<{ data: User }>(
            `${API_BASE}/users/me/profile`,
            data
        );
        return response.data.data;
    },
};

