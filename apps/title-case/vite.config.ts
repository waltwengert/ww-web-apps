import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/title-case/',
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts'
    }
});
