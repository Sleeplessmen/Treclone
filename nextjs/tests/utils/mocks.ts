import { vi } from 'vitest'

// Mock useParams helper
export const createMockParams = (overrides = {}) => ({
    workspaceId: 'ws-123',
    boardId: 'board-456',
    ...overrides,
})

// Mock next/navigation
export const mockNextNavigation = () => {
    vi.mock('next/navigation', () => ({
        useParams: vi.fn().mockReturnValue(createMockParams()),
        useRouter: vi.fn().mockReturnValue({
            push: vi.fn(),
            replace: vi.fn(),
            back: vi.fn(),
        }),
        useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
    }))
}

// Common mock for Sentry
export const mockSentry = () => {
    vi.mock('@sentry/nextjs', () => ({
        captureException: vi.fn(),
        captureMessage: vi.fn(),
    }))
}

// Mock react-query
export const mockQueryClient = () => ({
    queryCache: {
        clear: vi.fn(),
    },
    mutationCache: {
        clear: vi.fn(),
    },
})