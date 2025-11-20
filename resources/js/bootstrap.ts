import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Global error interceptor for authentication errors
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear authentication data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_token_expires_at');
            delete axios.defaults.headers.common['Authorization'];

            // Redirect to login if not already there
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);
