import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/future-weight/',
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts'
    }
});
