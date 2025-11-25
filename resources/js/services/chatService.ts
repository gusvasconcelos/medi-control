/**
 * Chat API Service
 *
 * Handles all chat-related API calls including sessions, messages,
 * and suggested prompts for the health assistant.
 */

import axios from 'axios';
import type {
    ChatSessionResponse,
    ChatMessagesResponse,
    SendMessageResponse,
    SuggestedPromptsResponse,
} from '@/types/chat';

const API_BASE = '/api/v1';

export const chatService = {
    /**
     * Get or create chat session with recent messages
     */
    async getSession(): Promise<ChatSessionResponse> {
        const response = await axios.get<ChatSessionResponse>(
            `${API_BASE}/chat/session`
        );
        return response.data;
    },

    /**
     * Get chat message history
     */
    async getMessages(): Promise<ChatMessagesResponse> {
        const response = await axios.get<ChatMessagesResponse>(
            `${API_BASE}/chat/messages`
        );
        return response.data;
    },

    /**
     * Send a message to the chat assistant
     */
    async sendMessage(message: string, isSuggestion = false): Promise<SendMessageResponse> {
        const response = await axios.post<SendMessageResponse>(
            `${API_BASE}/chat/messages`,
            { message, is_suggestion: isSuggestion }
        );
        return response.data;
    },

    /**
     * Clear chat history
     */
    async clearHistory(): Promise<void> {
        await axios.delete(`${API_BASE}/chat/history`);
    },

    /**
     * Get suggested prompts based on user context
     */
    async getSuggestedPrompts(): Promise<SuggestedPromptsResponse> {
        const response = await axios.get<SuggestedPromptsResponse>(
            `${API_BASE}/chat/suggested-prompts`
        );
        return response.data;
    },
};
