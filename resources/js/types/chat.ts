export interface ChatSession {
    id: number;
    user_id: number;
    title: string | null;
    started_at: string;
    last_message_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface ReorganizedMedication {
    id: number;
    name: string;
    old_time_slots: string[];
    new_time_slots: string[];
    start_date: string;
}

export interface ToolExecution {
    success: boolean;
    message: string;
    reorganized_medications: ReorganizedMedication[];
}

export interface ChatMessage {
    id: number;
    chat_session_id: number;
    role: 'user' | 'assistant' | 'system';
    content: string;
    metadata?: {
        tokens_used?: number;
        duration_ms?: number;
        context_snapshot?: Record<string, unknown>;
        model?: string;
        tool_calls?: Array<{
            id: string;
            type: string;
            function: {
                name: string;
                arguments: string;
            };
        }>;
        tool_execution?: ToolExecution;
    };
    created_at: string;
    updated_at: string;
}

export interface SendMessageResponse {
    message: ChatMessage;
    session_id: number;
}

export interface ChatMessagesResponse {
    data: ChatMessage[];
    session_id: number;
}

export interface ChatSessionResponse {
    session: ChatSession;
    messages: ChatMessage[];
}

export interface SuggestedPrompt {
    id: string;
    text: string;
    icon?: string;
}

export interface SuggestedPromptsResponse {
    data: SuggestedPrompt[];
}
