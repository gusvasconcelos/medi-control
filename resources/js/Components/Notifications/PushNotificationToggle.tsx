import { useState } from 'react';
import { useOneSignal } from '@/hooks/useOneSignal';
import { Bell, BellOff } from 'lucide-react';

export function PushNotificationToggle() {
    const [isRequesting, setIsRequesting] = useState(false);

    const {
        isInitialized,
        isSubscribed,
        hasPermission,
        requestPermission,
        unsubscribe,
    } = useOneSignal({
        onError: (error) => {
            console.error('OneSignal error:', error);
        },
    });

    const handleToggleNotifications = async () => {
        setIsRequesting(true);
        try {
            if (!isSubscribed && !hasPermission) {
                await requestPermission();
            } else if (isSubscribed) {
                await unsubscribe();
            }
        } catch (error) {
            console.error('Failed to toggle notifications:', error);
        } finally {
            setIsRequesting(false);
        }
    };

    if (!isInitialized) {
        return null;
    }

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={handleToggleNotifications}
                disabled={isRequesting}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isSubscribed
                        ? 'bg-success text-success-content hover:bg-success/90'
                        : 'bg-base-300 text-base-content hover:bg-base-content/10'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={isSubscribed ? 'Desativar notificações push' : 'Ativar notificações push'}
            >
                {isSubscribed ? (
                    <>
                        <Bell className="w-5 h-5" />
                        <span>Notificações Ativadas</span>
                    </>
                ) : (
                    <>
                        <BellOff className="w-5 h-5" />
                        <span>Ativar Notificações</span>
                    </>
                )}
            </button>

            {isSubscribed && (
                <span className="text-sm text-success">
                    Você receberá notificações push
                </span>
            )}
        </div>
    );
}
