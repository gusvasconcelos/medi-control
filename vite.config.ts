import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    server: {
        // Listen on all interfaces for Docker
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,

        // HMR configuration for Docker
        hmr: {
            host: process.env.VITE_HMR_HOST || 'localhost',
            port: 5173,
        },

        // File watching configuration for Docker bind mounts
        watch: {
            usePolling: true,
            interval: 1000,
        },
    },
});
