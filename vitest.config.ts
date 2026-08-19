import path from 'node:path'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const alias = {
    '@': path.resolve(__dirname, 'src'),
    '@generated/client': path.resolve(__dirname, 'prisma/generated/client'),
}

const shared = {
    globals: true,
    exclude: ['node_modules', 'dist'],
}

/**
 * Unit profile - default. Runs in jsdom with the testing-library setup,
 * coverage reporting and thresholds.
 */
function unitProfile() {
    return {
        environment: 'jsdom',
        include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
        setupFiles: ['./tests/setup.ts'],
        testTimeout: 10000,
        hookTimeout: 10000,
        teardownTimeout: 5000,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            include: ['src/**/*.{ts,tsx}'],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.d.ts',
                '**/*.stories.{ts,tsx}',
                '**/index.ts',
            ],
            thresholds: {
                lines: 70,
                functions: 70,
                branches: 60,
                statements: 70,
            },
        },
        reporters: ['default', 'html', 'json'],
        outputFile: {
            html: './coverage/index.html',
            json: './coverage/coverage.json',
        },
    }
}

/**
 * Node profile - used by integration and e2e suites (require a running
 * PostgreSQL instance, e.g. `docker compose up -d`).
 */
function nodeProfile(include: string[]) {
    return {
        environment: 'node',
        include,
        setupFiles: ['./tests/integration-setup.ts'],
        testTimeout: 30000,
        hookTimeout: 30000,
        reporters: ['default'],
    }
}

export default defineConfig(({ mode }) => {
    const isIntegration = mode === 'integration'
    const isE2e = mode === 'e2e'

    const profile = isIntegration
        ? nodeProfile(['tests/integration/**/*.integration.test.ts', 'tests/integration/**/*.integration.test.tsx'])
        : isE2e
          ? nodeProfile(['tests/e2e/**/*.e2e.test.ts'])
          : unitProfile()

    return {
        resolve: { alias },
        plugins: [react({ jsxRuntime: 'automatic' })],
        test: {
            ...shared,
            ...profile,
            // Nested objects are merged per key in Vitest; keep coverage only in the unit profile.
            ...profile,
        },
    }
})