# TESTING.md - Treclone Testing Strategy & Guidelines

**Version:** 1.0  
**Last Updated:** 2026-08-20  
**Status:** ACTIVE  
**Owner:** Engineering Team  
**Related:** [AGENTS.md](./AGENTS.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🎯 Overview

Treclone sử dụng **Test-Driven Development (TDD)** với vòng lặp **Red-Green-Refactor** bắt buộc theo [AGENTS.md](./AGENTS.md). Hệ thống test bao gồm 3 layer:

```
┌─────────────────────────────────────────────────────────────┐
│                        TEST PYRAMID                              │
├─────────────────────────────────────────────────────────────┤
│  🟢 Unit Tests (80%)    - Fast, isolated, no external deps   │
│  🟡 Integration Tests (15%) - Real DB, API flows                │
│  🔴 E2E Tests (5%)      - Full user journeys                    │
└─────────────────────────────────────────────────────────────┘
```

**Core Principle:** *Mọi behavior mới PHẢI có test trước khi merge vào `dev`*

---

## 📋 Test Structure

```
tests/
├── unit/                    # jsdom environment, no DB
│   ├── controllers/        # Controller unit tests
│   ├── services/           # Service unit tests (mocked repositories)
│   ├── repositories/       # Repository unit tests (mocked Prisma)
│   ├── utils/              # Utility function tests
│   ├── validation/         # Zod schema tests
│   └── hooks/              # React hook tests (useQuery, useMutation)
│
├── integration/            # node environment, real DB
│   ├── api/                # API endpoint tests
│   ├── flows/              # Multi-step user flows
│   ├── database/           # Database queries & transactions
│   └── auth/               # Authentication flows
│
├── e2e/                    # node environment, real DB
│   ├── auth/               # Full auth journeys
│   ├── workspaces/         # Workspace management flows
│   ├── boards/             # Board & list operations
│   └── cards/              # Card CRUD & DnD
│
├── setup.ts                # Global test setup (Vitest)
├── integration-setup.ts    # Integration test setup (DB connection)
└── utils/                  # Test utilities & factories
```

---

## 🚀 Quick Start

### Run Tests

```bash
# Run all tests (REQUIRED before push - xem AGENTS.md)
npm run test:all

# Run by mode
npm run test:unit        # Unit tests only (jsdom)
npm run test:integration   # Integration tests (needs Docker DB)
npm run test:e2e         # E2E tests (needs Docker DB)

# Run with watch mode
npm run test:unit:watch

# Run with coverage
npm run test:coverage
```

### Test Coverage Thresholds

Được cấu hình trong `vitest.config.ts`:

| Type | Threshold | Current |
|------|-----------|---------|
| Lines | ≥ 80% | - |
| Functions | ≥ 80% | - |
| Branches | ≥ 80% | - |
| Statements | ≥ 80% | - |

**Note:** Coverage được chạy tự động trong CI/CD pipeline.

---

## 🧪 Test Types

### 1. Unit Tests (`tests/unit/`)

**Environment:** jsdom  
**Database:** None (mocked)  
**Speed:** ⚡ Fast (< 100ms per test)  
**Purpose:** Test individual functions in isolation

#### What to Test
- ✅ Business logic in services
- ✅ Request/response handling in controllers
- ✅ Data transformations in repositories
- ✅ Validation schemas (Zod)
- ✅ Utility functions
- ✅ React hooks (renderHook)
- ✅ Pure components (without providers)

#### What NOT to Test
- ❌ Next.js routing
- ❌ API routes (use integration tests)
- ❌ Database queries (mock Prisma client)
- ❌ External API calls (mock with MSW or manual mocks)

#### Example: Service Unit Test

```typescript
// tests/unit/services/card.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CardService } from '@/lib/services/card.service'
import { CardRepository } from '@/lib/repositories/card.repository'
import { AppError } from '@/lib/utils/errors'

// Mock repository
vi.mock('@/lib/repositories/card.repository')

const mockCardRepository = vi.mocked(CardRepository)

describe('CardService', () => {
  const cardService = new CardService()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createCard', () => {
    it('should throw AppError when card title is empty', async () => {
      const input = { title: '', listId: '1', position: 0 }
      
      await expect(cardService.createCard(input)).rejects.toThrow(
        new AppError('Card title is required', 400, 'VALIDATION_ERROR')
      )
    })

    it('should call repository with correct data', async () => {
      const input = { title: 'Test Card', listId: '1', position: 0 }
      mockCardRepository.create.mockResolvedValue({ ...input, id: '1' })

      const result = await cardService.createCard(input)

      expect(mockCardRepository.create).toHaveBeenCalledWith(input)
      expect(result).toEqual({ ...input, id: '1' })
    })
  })
})
```

#### Example: Zod Schema Test

```typescript
// tests/unit/validation/card.schema.test.ts
import { describe, it, expect } from 'vitest'
import { createCardSchema, UpdateCardSchema } from '@/lib/validation/card.schema'

describe('Card Validation Schemas', () => {
  describe('createCardSchema', () => {
    it('should validate valid card data', () => {
      const validData = {
        title: 'Test Card',
        listId: '123',
        description: 'Test description',
        position: 0
      }

      const result = createCardSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should reject empty title', () => {
      const invalidData = { title: '', listId: '123', position: 0 }

      expect(() => createCardSchema.parse(invalidData)).toThrow(
        'Title is required'
      )
    })
  })
})
```

#### Example: Hook Test

```typescript
// tests/unit/hooks/cards/queries.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCard } from '@/hooks/cards/queries'

const queryClient = new QueryClient()
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useCard hook', () => {
  it('should fetch card data', async () => {
    const cardId = '1'
    const mockCard = { id: cardId, title: 'Test Card' }
    
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockCard)
    })

    const { result } = renderHook(() => useCard(cardId), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockCard)
  })
})
```

---

### 2. Integration Tests (`tests/integration/`)

**Environment:** node  
**Database:** Real PostgreSQL (Docker)  
**Speed:** 🟡 Medium (< 500ms per test)  
**Purpose:** Test interactions between components with real database

#### Setup

Trước khi chạy integration tests:
```bash
# Start Docker containers
docker compose up -d

# Run migrations
npx prisma migrate dev

# Run integration tests
npm run test:integration
```

#### Test Database Configuration

Cấu hình trong `tests/integration-setup.ts`:
- Kết nối đến Docker PostgreSQL
- Auto-clean database giữa các test
- Seed data cho tests

#### Example: API Endpoint Test

```typescript
// tests/integration/api/cards.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { setupTestDB, teardownTestDB } from '../integration-setup'
import { POST, GET } from '@/app/api/workspaces/[workspaceId]/boards/[boardId]/lists/[listId]/cards/route'
import { NextRequest } from 'next/server'

let workspaceId: string
let boardId: string
let listId: string

beforeAll(async () => {
  const setup = await setupTestDB()
  workspaceId = setup.workspaceId
  boardId = setup.boardId
  listId = setup.listId
})

afterAll(async () => {
  await teardownTestDB()
})

describe('Cards API', () => {
  describe('POST /cards', () => {
    it('should create a new card', async () => {
      const request = {
        json: () => Promise.resolve({
          title: 'New Card',
          position: 0
        }),
        nextUrl: { searchParams: {} }
      } as unknown as NextRequest

      const context = { params: { workspaceId, boardId, listId } }
      const response = await POST(request, context)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.title).toBe('New Card')
    })
  })

  describe('GET /cards', () => {
    it('should return all cards in a list', async () => {
      const context = { params: { workspaceId, boardId, listId } }
      const response = await GET(undefined, context)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })
  })
})
```

#### Example: Service Integration Test

```typescript
// tests/integration/services/card-move.service.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { CardService } from '@/lib/services/card.service'
import { CardRepository } from '@/lib/repositories/card.repository'
import { setupTestDB, teardownTestDB, createTestWorkspace } from '../integration-setup'

let cardService: CardService
let workspaceId: string
let boardId: string
let list1Id: string
let list2Id: string

beforeAll(async () => {
  await setupTestDB()
  const workspace = await createTestWorkspace()
  workspaceId = workspace.id
  boardId = workspace.boards[0].id
  list1Id = workspace.boards[0].lists[0].id
  list2Id = workspace.boards[0].lists[1].id
  
  cardService = new CardService()
})

afterAll(async () => {
  await teardownTestDB()
})

describe('CardService.moveCard', () => {
  it('should move card between lists and update positions', async () => {
    // Create card in list1
    const card = await cardService.createCard({
      title: 'Test Card',
      listId: list1Id,
      position: 0
    })

    // Move to list2
    const result = await cardService.moveCard(card.id, {
      listId: list2Id,
      newPosition: 0
    })

    expect(result.listId).toBe(list2Id)
    expect(result.position).toBe(0)

    // Verify old list has no cards
    const list1Cards = await new CardRepository().findByList(list1Id)
    expect(list1Cards.length).toBe(0)

    // Verify new list has the card
    const list2Cards = await new CardRepository().findByList(list2Id)
    expect(list2Cards.length).toBe(1)
    expect(list2Cards[0].id).toBe(card.id)
  })
})
```

---

### 3. E2E Tests (`tests/e2e/`)

**Environment:** node  
**Database:** Real PostgreSQL (Docker)  
**Speed:** 🔴 Slow (> 1s per test)  
**Purpose:** Test complete user journeys from API to database

#### Example: Authentication Flow

```typescript
// tests/e2e/auth.flow.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { setupTestDB, teardownTestDB } from '../integration-setup'
import { POST } from '@/app/api/auth/register/route'
import { POST as loginPOST } from '@/app/api/auth/login/route'
import { GET } from '@/app/api/auth/me/route'

beforeAll(async () => {
  await setupTestDB()
})

afterAll(async () => {
  await teardownTestDB()
})

describe('Authentication E2E Flow', () => {
  it('should register, login, and get user profile', async () => {
    // Step 1: Register
    const registerRequest = {
      json: () => Promise.resolve({
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User'
      }),
      nextUrl: { searchParams: {} }
    }
    
    const registerResponse = await POST(registerRequest, {})
    expect(registerResponse.status).toBe(201)

    // Step 2: Login
    const loginRequest = {
      json: () => Promise.resolve({
        email: 'test@example.com',
        password: 'password123'
      }),
      nextUrl: { searchParams: {} }
    }
    
    const loginResponse = await loginPOST(loginRequest, {})
    expect(loginResponse.status).toBe(200)
    const loginData = await loginResponse.json()
    
    // Step 3: Get profile (with auth)
    const profileRequest = {
      cookies: { get: () => ({ value: loginData.data.accessToken }) }
    }
    
    const profileResponse = await GET(profileRequest, {})
    expect(profileResponse.status).toBe(200)
    const profileData = await profileResponse.json()
    
    expect(profileData.data.email).toBe('test@example.com')
    expect(profileData.data.fullName).toBe('Test User')
  })
})
```

---

## 🛠️ Test Utilities

### Factory Functions

Tạo test data dễ dàng với factories:

```typescript
// tests/utils/factories.ts
export function createTestUser(overrides: Partial<User> = {}): User {
  return {
    id: `user-${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    password: 'hashed-password',
    fullName: 'Test User',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }
}

export function createTestWorkspace(overrides: Partial<Workspace> = {}): Workspace {
  return {
    id: `workspace-${Date.now()}`,
    name: 'Test Workspace',
    ownerId: `user-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }
}

export function createTestBoard(overrides: Partial<Board> = {}): Board {
  return {
    id: `board-${Date.now()}`,
    name: 'Test Board',
    workspaceId: `workspace-${Date.now()}`,
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  }
}
```

### Mock Helpers

```typescript
// tests/utils/mocks.ts
export function mockPrismaClient() {
  return {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    workspace: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    // ... other models
  }
}

export function createMockRequest(jsonData: any, userId?: string) {
  return {
    json: () => Promise.resolve(jsonData),
    nextUrl: { searchParams: {} },
    cookies: {
      get: (name: string) => {
        if (name === 'accessToken' && userId) {
          return { value: `mock-token-${userId}` }
        }
        return null
      }
    }
  } as unknown as NextRequest
}
```

### Assertion Helpers

```typescript
// tests/utils/assertions.ts
export function expectAppError(error: unknown, status: number, code: string) {
  expect(error).toBeInstanceOf(AppError)
  const appError = error as AppError
  expect(appError.statusCode).toBe(status)
  expect(appError.code).toBe(code)
}

export function expectValidationError(error: unknown, message: string) {
  expect(error).toBeInstanceOf(ZodError)
  const zodError = error as ZodError
  expect(zodError.errors.some(e => e.message.includes(message))).toBe(true)
}

export async function expectUnauthorized(request: any, context: any) {
  const response = await routeHandler(request, context)
  expect(response.status).toBe(401)
  const data = await response.json()
  expect(data.success).toBe(false)
  expect(data.error?.code).toBe('UNAUTHORIZED')
}
```

---

## 🎨 Best Practices

### 1. Test Naming Convention

```typescript
// ✅ GOOD
describe('CardService', () => {
  describe('createCard', () => {
    it('should throw AppError when title is empty')
    it('should create card with valid data')
    it('should set default position to 0 when not provided')
  })
})

// ❌ BAD - Too generic
it('should work')
it('test create card')

// ❌ BAD - Not descriptive
it('should return something')
```

### 2. Test Structure (AAA Pattern)

```typescript
// ✅ GOOD - AAA Pattern (Arrange, Act, Assert)
it('should create card with valid data', async () => {
  // Arrange
  const input = { title: 'Test Card', listId: '1', position: 0 }
  mockRepository.create.mockResolvedValue({ ...input, id: '1' })

  // Act
  const result = await service.createCard(input)

  // Assert
  expect(mockRepository.create).toHaveBeenCalledWith(input)
  expect(result).toEqual({ ...input, id: '1' })
})
```

### 3. Mocking Guidelines

- ✅ **Mock dependencies**, not implementation
- ✅ **Use vi.mock()** for module mocking
- ✅ **Use vi.fn()** for function mocking
- ✅ **Reset mocks** in beforeEach/afterEach
- ❌ **Don't mock everything** - test real interactions when possible

```typescript
// ✅ GOOD - Mock repository, test service logic
vi.mock('@/lib/repositories/card.repository')

// ❌ BAD - Mocking too much, tests nothing
vi.mock('@/lib/services/card.service')
vi.mock('@/lib/controllers/card.controller')
```

### 4. Database Testing

- ✅ **Integration/E2E tests** use real database
- ✅ **Clean database** between tests (use transactions or truncate)
- ✅ **Seed test data** in beforeAll/beforeEach
- ❌ **Don't rely on existing data** - always create fresh test data

### 5. Test Isolation

- ✅ **Each test independent** - no shared state
- ✅ **Reset mocks** between tests
- ✅ **Clean up** resources (DB connections, files)
- ❌ **Don't use global state** in tests

### 6. Test Performance

- ✅ **Unit tests < 100ms** each
- ✅ **Integration tests < 500ms** each
- ✅ **Parallelize tests** where possible
- ❌ **Avoid sleep/timeout** - use proper waitFor

---

## 🚨 Common Anti-Patterns

### ❌ Testing Implementation Details

```typescript
// ❌ BAD - Testing internal method
it('should call private method', () => {
  const service = new CardService()
  expect(service['internalMethod']).toHaveBeenCalled()
})

// ✅ GOOD - Testing public behavior
it('should return expected result', () => {
  const result = service.createCard(input)
  expect(result).toEqual(expected)
})
```

### ❌ Over-Mocking

```typescript
// ❌ BAD - Mocking everything
vi.mock('@/lib/services/card.service')
vi.mock('@/lib/repositories/card.repository')
vi.mock('@/lib/controllers/card.controller')

// ✅ GOOD - Mock only dependencies
vi.mock('@/lib/repositories/card.repository')
```

### ❌ Testing Next.js Specifics

```typescript
// ❌ BAD - Testing Next.js routing
it('should redirect', () => {
  const response = await handler(request)
  expect(response.redirect).toHaveBeenCalled()
})

// ✅ GOOD - Testing behavior, not framework specifics
it('should return 302 with location header', async () => {
  const response = await handler(request)
  expect(response.status).toBe(302)
  expect(response.headers.get('location')).toBe('/login')
})
```

### ❌ Flaky Tests

```typescript
// ❌ BAD - Depends on timing
it('should work after timeout', async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  expect(something).toBe(true)
})

// ✅ GOOD - Use proper waitFor
it('should work after condition met', async () => {
  await waitFor(() => expect(something).toBe(true))
})
```

### ❌ Testing Third-Party Libraries

```typescript
// ❌ BAD - Testing bcrypt
it('should hash password', () => {
  const hash = bcrypt.hashSync('password', 10)
  expect(bcrypt.compareSync('password', hash)).toBe(true)
})

// ✅ GOOD - Trust third-party libraries
// Just test that you use them correctly
```

---

## 📊 Test Coverage Reporting

### Generate Coverage Report

```bash
npm run test:coverage
```

Report sẽ được sinh ra ở:
- `coverage/` - HTML report (mở `coverage/index.html` trong browser)
- Terminal output - Summary

### Coverage Badges

Thêm badge vào README.md:
```markdown
![Test Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)
```

### CI/CD Integration

Cấu hình trong `.github/workflows/test.yml`:
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: treclone123
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:all
      - run: npm run test:coverage
```

---

## 🔗 Related Documentation

| Document | Purpose |
|----------|---------|
| [AGENTS.md](./AGENTS.md) | Agent workflow & TDD requirements |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture & layers |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Development workflow & PR process |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Local development setup |
| [DESIGN.md](./DESIGN.md) | Design system & UI conventions |
| [REVIEW.md](./REVIEW.md) | Current state & implementation plan |

---

## 📝 Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-08-20 | Initial release - Complete testing strategy |

---

**Maintainers:** Engineering Team  
**Questions:** Refer to [AGENTS.md](./AGENTS.md) for workflow questions  
**Issues:** Report in GitHub Issues with `label:testing`
