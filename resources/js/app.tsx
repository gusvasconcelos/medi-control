import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ToastProvider } from '@/contexts/ToastContext';
import { ToastContainer } from '@/Components/ToastContainer';
import AppLayout from '@/Layouts/AppLayout';
import { configureEcho } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

const appName = import.meta.env.VITE_APP_NAME || 'MediControl';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ).then((module) => {
            const page = module as { default: { layout?: unknown } };
            page.default.layout = page.default.layout || ((page: React.ReactNode) => <AppLayout>{page}</AppLayout>);
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
