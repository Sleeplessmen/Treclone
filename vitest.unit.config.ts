import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'unit-tests',
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup/unit.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx', 'src/**/*.spec.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/tests/integration/**',
      '**/tests/e2e/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'src/app/**',
        'src/lib/db/**',
        '**/*.config.*',
        '.next/',
      ],
    },
    passWithNoTests: false,
    watch: false,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
