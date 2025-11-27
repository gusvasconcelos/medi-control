import type { DeviceType } from '@/types';

export interface DeviceInfo {
    deviceType: DeviceType;
    browser: string;
    os: string;
    deviceName: string;
}

export function detectDevice(): DeviceInfo {
    const ua = navigator.userAgent;

    // Detect device type
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);

    let deviceType: DeviceType = 'desktop';
    if (isTablet) {
        deviceType = 'tablet';
    } else if (isMobile) {
        deviceType = 'mobile';
    }

    // Detect browser
    let browser = 'Unknown';
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
        browser = 'Chrome';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
        browser = 'Safari';
    } else if (ua.includes('Firefox')) {
        browser = 'Firefox';
    } else if (ua.includes('Edg')) {
        browser = 'Edge';
    } else if (ua.includes('Opera') || ua.includes('OPR')) {
        browser = 'Opera';
    }

    // Detect OS
    let os = 'Unknown';
    if (ua.includes('Win')) {
        os = 'Windows';
    } else if (ua.includes('Mac')) {
        os = 'macOS';
    } else if (ua.includes('Linux')) {
        os = 'Linux';
    } else if (ua.includes('Android')) {
        os = 'Android';
    } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
        os = 'iOS';
    }

    // Create device name
    const deviceName = `${browser} on ${os}`;

    return {
        deviceType,
        browser,
        os,
        deviceName,
    };
}
