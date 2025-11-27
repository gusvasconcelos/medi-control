import { useEffect, useState } from 'react';
import { oneSignalService } from '@/services/oneSignalService';
import { detectDevice } from '@/utils/deviceDetection';

interface UseOneSignalOptions {
    enabled?: boolean;
    onInitialized?: () => void;
    onSubscribed?: (playerId: string) => void;
    onError?: (error: Error) => void;
}

export function useOneSignal(options: UseOneSignalOptions = {}) {
    const { enabled = true, onInitialized, onSubscribed, onError } = options;

    const [isInitialized, setIsInitialized] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [playerId, setPlayerId] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        if (!enabled) return;

        const waitForOneSignal = () => {
            // Wait for OneSignal to be initialized by the script in HTML
            if (window.OneSignal) {
                setupOneSignal();
            } else if (window.OneSignalDeferred) {
                window.OneSignalDeferred.push(setupOneSignal);
            } else {
                // Retry after a short delay
                setTimeout(waitForOneSignal, 100);
            }
        };

        const setupOneSignal = async () => {
            try {
                if (!window.OneSignal) {
                    console.error('OneSignal not available');
                    return;
                }

                setIsInitialized(true);
                onInitialized?.();

                const permission = window.OneSignal.Notifications.permission;
                setHasPermission(permission);

                window.OneSignal.on('subscriptionChange', async (event: unknown) => {
                    const isSubscribed = Boolean(event);
                    setIsSubscribed(isSubscribed);

                    if (isSubscribed) {
                        const subscription = window.OneSignal?.User.PushSubscription;
                        const currentPlayerId = subscription?.id;

                        if (currentPlayerId) {
                            setPlayerId(currentPlayerId);
                            try {
                                const deviceInfo = detectDevice();
                                await oneSignalService.registerPlayerId(
                                    currentPlayerId,
                                    deviceInfo.deviceType,
                                    deviceInfo.browser,
                                    deviceInfo.os,
                                    deviceInfo.deviceName
                                );
                                onSubscribed?.(currentPlayerId);
                            } catch (error) {
                                console.error('Failed to register player ID:', error);
                                onError?.(error instanceof Error ? error : new Error(String(error)));
                            }
                        }
                    }
                });

                const currentSubscription = window.OneSignal?.User.PushSubscription;
                if (currentSubscription?.id) {
                    setPlayerId(currentSubscription.id);
                    setIsSubscribed(true);
                }
            } catch (error) {
                console.error('OneSignal setup error:', error);
                onError?.(error instanceof Error ? error : new Error(String(error)));
            }
        };

        waitForOneSignal();
    }, [enabled, onInitialized, onSubscribed, onError]);

    const requestPermission = async () => {
        if (!window.OneSignal) {
            throw new Error('OneSignal not initialized');
        }

        try {
            await window.OneSignal.Notifications.requestPermission();
            setHasPermission(true);
        } catch (error) {
            console.error('Failed to request permission:', error);
            throw error;
        }
    };

    const unsubscribe = async () => {
        if (!playerId) {
            throw new Error('No player ID to unsubscribe');
        }

        try {
            await oneSignalService.unregisterPlayerId(playerId);
            setIsSubscribed(false);
            setPlayerId(null);
        } catch (error) {
            console.error('Failed to unsubscribe:', error);
            throw error;
        }
    };

    return {
        isInitialized,
        isSubscribed,
        playerId,
        hasPermission,
        requestPermission,
        unsubscribe,
    };
}
