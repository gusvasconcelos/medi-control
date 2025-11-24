import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AuthenticatedLayout } from '@/Layouts/AuthenticatedLayout';
import { ChatInterface } from '@/Components/Chat/ChatInterface';
import { getNavigationItems } from '@/config/navigation';
import type { PageProps } from '@/types';
import type { UIMessage, ChatMessage } from '@/types/chat';
import { chatService } from '@/services/chatService';

export default function Chat({ auth }: PageProps) {
    const user = auth?.user;
    const userRoles = user?.roles || [];
    const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    useEffect(() => {
        // Load chat history
        chatService
            .getHistory()
            .then((response) => {
                const messages: UIMessage[] = response.data.messages.map(
                    (msg: ChatMessage) => ({
                        id: `msg-${msg.id}`,
                        role: msg.role,
                        parts: [
                            {
                                type: 'text',
                                text: msg.content,
                            },
                        ],
                    })
                );
                setInitialMessages(messages);
            })
            .catch((error) => {
                console.error('Failed to load chat history:', error);
            })
            .finally(() => {
                setIsLoadingHistory(false);
            });
    }, []);

    return (
        <>
            <Head title="Chat" />

            <AuthenticatedLayout
                navItems={getNavigationItems('/chat', userRoles)}
            >
                <div className="flex h-[calc(100vh-4rem)] bg-base-100 lg:h-[calc(100vh-5rem)]">
                    <div className="container mx-auto flex max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-6">
                        <div className="card flex-1 bg-base-100">
                            <div className="card-body h-full p-0">
                                {isLoadingHistory ? (
                                    <div className="flex h-full items-center justify-center">
                                        <span className="loading loading-spinner loading-lg"></span>
                                    </div>
                                ) : (
                                    <ChatInterface
                                        initialMessages={initialMessages}
                                        userName={user?.name}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

