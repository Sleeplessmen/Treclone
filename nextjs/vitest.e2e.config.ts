import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/e2e/**/*.e2e.test.ts'],
        exclude: ['node_modules', 'dist'],
        setupFiles: ['./tests/integration-setup.ts'],
        testTimeout: 30000,
        hookTimeout: 30000,
        reporters: ['default'],
    },
})