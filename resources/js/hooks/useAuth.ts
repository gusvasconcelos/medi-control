import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import type { PageProps } from '@/types';

export function useAuth() {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user ?? null;
    const isAuthenticated = !!user;

    const logout = async () => {
        try {
            await axios.post('/logout');
        } finally {
            router.visit('/login');
        }
    };

    return {
        user,
        isAuthenticated,
        logout,
    };
}
