import { Bot, User } from 'lucide-react';
import type { UIMessage } from '@/types/chat';

interface MessageBubbleProps {
    message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    // Extract text content from message parts
    const textContent = message.parts
        .filter((part) => part.type === 'text')
        .map((part) => part.text || '')
        .join('');

    return (
        <div
            className={`flex gap-3 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
            }`}
        >
            {/* Avatar */}
            <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full shadow-sm ${
                    isUser
                        ? 'bg-primary text-primary-content'
                        : 'bg-base-300 text-base-content'
                }`}
            >
                {isUser ? (
                    <User className="h-5 w-5" />
                ) : (
                    <Bot className="h-5 w-5" />
                )}
            </div>

            {/* Message Content */}
            <div
                className={`flex max-w-[80%] flex-col gap-1 sm:max-w-[70%] ${
                    isUser ? 'items-end' : 'items-start'
                }`}
            >
                <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                        isUser
                            ? 'bg-primary text-primary-content'
                            : 'bg-base-200 text-base-content'
                    }`}
                >
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {textContent || '...'}
                    </p>
                </div>
            </div>
        </div>
    );
}

