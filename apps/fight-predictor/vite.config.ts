import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    base: '/ww-web-apps/fight-predictor/',
    server: {
        port: 4178,
        strictPort: true
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts'
    }
});
