/**
 * Chat API Service
 *
 * Handles all chat-related API calls
 */

import axios from 'axios';
import type { ChatHistoryResponse } from '@/types/chat';

const API_BASE = '/api/v1';

export const chatService = {
    /**
     * Get chat history
     */
    async getHistory(): Promise<ChatHistoryResponse> {
        const response = await axios.get<ChatHistoryResponse>(
            `${API_BASE}/chat/history`
        );
        return response.data;
    },
};

