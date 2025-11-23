/**
 * Permission API Service
 *
 * Handles all permission-related API calls
 */

import axios from 'axios';
import type { Permission, PermissionGroup } from '@/types/permissions';

const API_BASE = '/api/v1';

export const permissionService = {
    /**
     * Get paginated list of permissions
     */
    async getPermissions(params?: {
        page?: number;
        per_page?: number;
        search?: string;
        group?: string;
        all?: boolean;
    }): Promise<{
        data: Permission[];
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

        if (params?.group && params.group.trim() !== '') {
            queryParams.group = params.group;
        }

        const response = await axios.get(`${API_BASE}/permissions`, {
            params: queryParams,
        });
        return response.data;
    },

    /**
     * Get permissions grouped by group
     */
    async getGroupedPermissions(): Promise<PermissionGroup[]> {
        const response = await axios.get<{ data: PermissionGroup[] }>(
            `${API_BASE}/permissions-grouped`
        );
        return response.data.data;
    },

    /**
     * Get a single permission by ID
     */
    async getPermission(id: number): Promise<Permission> {
        const response = await axios.get<{ data: Permission }>(
            `${API_BASE}/permissions/${id}`
        );
        return response.data.data;
    },

    /**
     * Create a new permission
     */
    async createPermission(data: {
        name: string;
        display_name: string;
        description?: string;
        group?: string;
    }): Promise<Permission> {
        const response = await axios.post<{ data: Permission }>(
            `${API_BASE}/permissions`,
            data
        );
        return response.data.data;
    },

    /**
     * Update an existing permission
     */
    async updatePermission(
        id: number,
        data: {
            name: string;
            display_name: string;
            description?: string;
            group?: string;
        }
    ): Promise<Permission> {
        const response = await axios.put<{ data: Permission }>(
            `${API_BASE}/permissions/${id}`,
            data
        );
        return response.data.data;
    },

    /**
     * Delete a permission
     */
    async deletePermission(id: number): Promise<void> {
        await axios.delete(`${API_BASE}/permissions/${id}`);
    },
};

