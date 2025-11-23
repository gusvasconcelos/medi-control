/**
 * Role API Service
 *
 * Handles all role-related API calls
 */

import axios from 'axios';
import type { Role } from '@/types/permissions';

const API_BASE = '/api/v1';

export const roleService = {
    /**
     * Get paginated list of roles
     */
    async getRoles(params?: {
        page?: number;
        per_page?: number;
        search?: string;
        all?: boolean;
    }): Promise<{
        data: Role[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    }> {
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

        if (params?.search && params.search.trim() !== '') {
            queryParams.q = JSON.stringify({ text: params.search });
        }

        const response = await axios.get(`${API_BASE}/roles`, {
            params: queryParams,
        });
        return response.data;
    },

    /**
     * Get a single role by ID
     */
    async getRole(id: number): Promise<Role> {
        const response = await axios.get<{ data: Role }>(
            `${API_BASE}/roles/${id}`
        );
        return response.data.data;
    },

    /**
     * Create a new role
     */
    async createRole(data: {
        name: string;
        display_name: string;
        description?: string;
        permissions?: number[];
    }): Promise<Role> {
        const response = await axios.post<{ data: Role }>(
            `${API_BASE}/roles`,
            data
        );
        return response.data.data;
    },

    /**
     * Update an existing role
     */
    async updateRole(
        id: number,
        data: {
            name: string;
            display_name: string;
            description?: string;
            permissions?: number[];
        }
    ): Promise<Role> {
        const response = await axios.put<{ data: Role }>(
            `${API_BASE}/roles/${id}`,
            data
        );
        return response.data.data;
    },

    /**
     * Delete a role
     */
    async deleteRole(id: number): Promise<void> {
        await axios.delete(`${API_BASE}/roles/${id}`);
    },

    /**
     * Sync permissions for a role
     */
    async syncPermissions(
        id: number,
        permissionIds: number[]
    ): Promise<Role> {
        const response = await axios.post<{ data: Role }>(
            `${API_BASE}/roles/${id}/sync-permissions`,
            { permissions: permissionIds }
        );
        return response.data.data;
    },
};

