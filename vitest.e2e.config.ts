import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'e2e-tests',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup/e2e.ts'],
    include: ['tests/e2e/**/*.test.ts', 'tests/e2e/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '**/*.config.*'],
    },
    passWithNoTests: false,
    watch: false,
    // E2E tests may need more time
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
