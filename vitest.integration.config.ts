import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'integration-tests',
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup/integration.ts'],
    include: ['tests/integration/**/*.test.ts', 'tests/integration/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '**/*.config.*'],
    },
    passWithNoTests: false,
    watch: false,
    // For database tests
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
