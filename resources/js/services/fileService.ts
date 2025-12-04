/**
 * File API Service
 *
 * Handles all file upload-related API calls
 */

import axios from 'axios';

const API_BASE = '/api/v1';

export interface FileUploadResponse {
    message: string;
    data: {
        id: number;
        uploaded_by: number;
        original_name: string;
        stored_name: string;
        path: string;
        disk: string;
        mime_type: string;
        size: number;
        visibility: string;
        metadata?: Record<string, unknown>;
        active: boolean;
        created_at: string;
        updated_at: string;
    };
}

export const fileService = {
    /**
     * Upload a file for a user
     */
    async uploadUserFile(
        userId: number,
        file: File,
        visibility: 'private' | 'public' | 'shared' = 'public'
    ): Promise<FileUploadResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('visibility', visibility);
        formData.append('disk', 'minio');

        const response = await axios.post<FileUploadResponse>(
            `${API_BASE}/users/${userId}/files`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    },

    /**
     * Get full URL for a file path
     */
    getFileUrl(path?: string): string | undefined {
        if (!path) return undefined;

        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }

        return path;
    },
};
