import { useAuth } from './useAuth';

export function useRole() {
    const { user } = useAuth();
    const roles = user?.roles || [];

    const hasRole = (...rolesToCheck: string[]): boolean => {
        if (rolesToCheck.length === 0) return true;
        return rolesToCheck.some(role => roles.includes(role));
    };

    const hasAllRoles = (...rolesToCheck: string[]): boolean => {
        if (rolesToCheck.length === 0) return true;
        return rolesToCheck.every(role => roles.includes(role));
    };

    const isSuperAdmin = (): boolean => {
        return roles.includes('super-admin');
    };

    const isPatient = (): boolean => {
        return roles.includes('patient');
    };

    const isCaregiver = (): boolean => {
        return roles.includes('caregiver');
    };

    return {
        roles,
        hasRole,
        hasAllRoles,
        isSuperAdmin,
        isPatient,
        isCaregiver,
    };
}

