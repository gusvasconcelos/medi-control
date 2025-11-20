import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/Components/ToastContainer';
import AppLayout from '@/Layouts/AppLayout';
import axios from 'axios';

const appName = import.meta.env.VITE_APP_NAME || 'MediControl';

// Setup Inertia to include JWT token in all requests
router.on('before', (event) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Also set for Inertia requests
        event.detail.visit.headers = {
            ...event.detail.visit.headers,
            'Authorization': `Bearer ${token}`,
        };
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ).then((module) => {
            // Add AppLayout to all pages by default
            const page = module as any;
            page.default.layout = page.default.layout || ((page: any) => <AppLayout>{page}</AppLayout>);
            return page;
        }),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ToastProvider>
                <App {...props} />
                <ToastContainer />
            </ToastProvider>
        );
    },
    progress: {
        color: '#0D7FFF',
    },
});
