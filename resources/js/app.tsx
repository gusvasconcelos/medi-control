import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/Components/ToastContainer';
import AppLayout from '@/Layouts/AppLayout';

const appName = import.meta.env.VITE_APP_NAME || 'MediControl';

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
