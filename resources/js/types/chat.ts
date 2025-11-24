/**
 * Chat Types
 */

export type ChatContextType = 'general' | 'medication' | 'interaction' | 'symptom' | 'other';

export interface ChatSession {
    id: number;
    user_id: number;
    started_at: string;
    ended_at?: string | null;
    expires_at: string;
    context_type: ChatContextType;
    created_at: string;
}

export interface ChatMessage {
    id: number;
    chat_session_id: number;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

export interface ChatHistoryResponse {
    data: {
        session: ChatSession;
        messages: ChatMessage[];
    };
}

/**
 * AI SDK UI Message types (compatible with @ai-sdk/react)
 */
export interface UIMessagePart {
    type: 'text' | string;
    text?: string;
    [key: string]: unknown;
}

export interface UIMessage {
    id: string;
    role: 'user' | 'assistant';
    parts: UIMessagePart[];
    metadata?: Record<string, unknown>;
}

