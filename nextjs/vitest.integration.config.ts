import path from 'node:path'
import { defineConfig } from 'vitest/config'  // Changed from 'vite'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/integration/**/*.integration.test.ts', 'tests/integration/**/*.integration.test.tsx'],  // Changed from src/**
        exclude: ['node_modules', 'dist'],
        testTimeout: 30000,
        hookTimeout: 30000,
        setupFiles: ['./tests/integration-setup.ts'],  // Changed from ./src/tests/integration-setup.ts
        reporters: ['default'],
    },
})