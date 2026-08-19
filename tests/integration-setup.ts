import { vi } from 'vitest'

// Mock environment variables for integration/e2e tests.
// Falls back to the Docker Compose database (see docker-compose.yml).
process.env.DATABASE_URL =
    process.env.DATABASE_URL || 'postgresql://treclone:treclone123@localhost:5432/treclone'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key'

// Mock Sentry for integration tests
vi.mock('@sentry/nextjs', () => ({
    captureException: vi.fn(),
    captureMessage: vi.fn(),
}))