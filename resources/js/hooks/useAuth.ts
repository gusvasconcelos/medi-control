import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import type { User, AuthResponse } from '@/types';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRES_KEY = 'auth_token_expires_at';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = getToken();

        if (token && !isTokenExpired()) {
            setupAxiosInterceptor(token);
            fetchAuthenticatedUser();
        } else {
            clearAuth();
            setIsLoading(false);
        }
    }, []);

    const setupAxiosInterceptor = (token: string) => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const fetchAuthenticatedUser = async () => {
        try {
            const response = await axios.get<User>('/api/v1/auth/me');
            setUser(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            clearAuth();
        } finally {
            setIsLoading(false);
        }
    };

    const saveAuthData = (authResponse: AuthResponse) => {
        const { access_token, expires_in } = authResponse;
        const expiresAt = Date.now() + expires_in * 1000;

        localStorage.setItem(TOKEN_KEY, access_token);
        localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString());

        setupAxiosInterceptor(access_token);
    };

    const getToken = (): string | null => {
        return localStorage.getItem(TOKEN_KEY);
    };

    const isTokenExpired = (): boolean => {
        const expiresAt = localStorage.getItem(TOKEN_EXPIRES_KEY);
        if (!expiresAt) return true;

        return Date.now() >= parseInt(expiresAt, 10);
    };

    const clearAuth = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_EXPIRES_KEY);
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsAuthenticated(false);
    };

    const logout = async () => {
        try {
            await axios.post('/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuth();
            router.visit('/login');
        }
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        saveAuthData,
        getToken,
        logout,
        clearAuth,
    };
}
