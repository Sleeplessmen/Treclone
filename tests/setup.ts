import '@testing-library/jest-dom'
import { afterEach, vi, afterAll, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { QueryClient } from '@tanstack/react-query'

declare global {
    var queryClient: QueryClient
}

globalThis.queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

// Cleanup after each test
afterEach(() => {
    cleanup()
    vi.clearAllMocks()
})

// Mock window.matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
})

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
    disconnect() {
        // Mock implementation
    }

    observe() {
        // Mock implementation
    }

    takeRecords() {
        return []
    }

    unobserve() {
        // Mock implementation
    }
} as unknown as typeof IntersectionObserver

// Suppress console errors in tests
const originalError = console.error
beforeAll(() => {
    console.error = (...args: unknown[]) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render')
        ) {
            return
        }
        originalError.call(console, ...args)
    }
})

afterAll(() => {
    console.error = originalError
})