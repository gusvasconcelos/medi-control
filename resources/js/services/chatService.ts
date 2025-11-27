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
     * Send a message to the chat assistant with streaming response
     */
    async sendMessageStream(
        message: string,
        isSuggestion: boolean,
        onChunk: (chunk: {
            type: string;
            content?: string;
            userMessageId?: number;
            sessionId?: number;
            assistantMessageId?: number;
            tool_calls?: Array<{
                id: string;
                type: string;
                function: {
                    name: string;
                    arguments: string;
                };
            }>;
            tool_execution?: {
                success: boolean;
                message: string;
                reorganized_medications?: Array<{
                    id: number;
                    name: string;
                    old_time_slots: string[];
                    new_time_slots: string[];
                    start_date: string;
                }>;
            };
        }) => void
    ): Promise<void> {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const authToken = localStorage.getItem('auth_token');

        const response = await fetch(`${API_BASE}/chat/messages/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
                'X-CSRF-TOKEN': csrfToken || '',
                ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
            },
            credentials: 'include',
            body: JSON.stringify({ message, is_suggestion: isSuggestion }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error('Response body is not readable');
        }

        let buffer = '';

        console.log('[SSE] Starting to read stream...');

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                console.log('[SSE] Stream completed');
                break;
            }

            const chunk = decoder.decode(value, { stream: true });
            console.log('[SSE] Received chunk:', chunk);

            buffer += chunk;

            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    try {
                        const parsed = JSON.parse(data);
                        console.log('[SSE] Parsed event:', parsed);

                        if (parsed.type !== 'done') {
                            onChunk(parsed);
                        }
                    } catch (e) {
                        console.error('[SSE] Failed to parse SSE data:', e, 'Raw:', data);
                    }
                } else if (line.startsWith(':')) {
                    console.log('[SSE] Comment:', line);
                }
            }
        }
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
