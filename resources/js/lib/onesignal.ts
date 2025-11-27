// OneSignal initialization without external SDK loading
// Uses dynamic script injection to avoid CORS/tracking issues

let isInitializing = false;
let isInitialized = false;

interface OneSignalConfig {
    appId: string;
    allowLocalhostAsSecureOrigin?: boolean;
    serviceWorkerPath?: string;
    serviceWorkerScope?: string;
}

export async function initializeOneSignal(config: OneSignalConfig): Promise<void> {
    if (isInitialized) {
        return;
    }

    if (isInitializing) {
        // Wait for initialization to complete
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (isInitialized) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });
    }

    isInitializing = true;

    try {
        // Load OneSignal SDK dynamically
        await loadOneSignalSDK();

        // Wait for OneSignal to be available
        await waitForOneSignal();

        // Initialize OneSignal
        if (window.OneSignal) {
            await window.OneSignal.init({
                appId: config.appId,
                allowLocalhostAsSecureOrigin: config.allowLocalhostAsSecureOrigin ?? false,
                serviceWorkerParam: {
                    scope: config.serviceWorkerScope || '/',
                },
                serviceWorkerPath: config.serviceWorkerPath || 'OneSignalSDKWorker.js',
            });

            isInitialized = true;
        }
    } catch (error) {
        console.error('Failed to initialize OneSignal:', error);
        isInitializing = false;
        throw error;
    }

    isInitializing = false;
}

function loadOneSignalSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.OneSignal) {
            resolve();
            return;
        }

        // Create script element
        const script = document.createElement('script');
        script.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
        script.async = true;
        script.defer = true;

        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load OneSignal SDK'));

        // Append to document
        document.head.appendChild(script);
    });
}

function waitForOneSignal(timeout = 10000): Promise<void> {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const checkInterval = setInterval(() => {
            if (window.OneSignal) {
                clearInterval(checkInterval);
                resolve();
            } else if (Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                reject(new Error('OneSignal initialization timeout'));
            }
        }, 100);
    });
}

export function isOneSignalReady(): boolean {
    return isInitialized && !!window.OneSignal;
}
