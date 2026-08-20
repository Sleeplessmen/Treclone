# DEVELOPMENT.md - Treclone Local Development Guide

**Version:** 1.0  
**Last Updated:** 2026-08-20  
**Status:** ACTIVE  
**Owner:** Engineering Team  
**Related:** [AGENTS.md](./AGENTS.md), [CONTRIBUTING.md](./CONTRIBUTING.md), [TESTING.md](./TESTING.md), [REVIEW.md](./REVIEW.md)

---

## 🚀 Quick Start (5 phút)

Thực hiện theo các bước sau để setup môi trường phát triển locally:

```bash
# 1. Clone repository
git clone https://github.com/Sleeplessmen/Treclone.git
cd Treclone

# 2. Cài đặt dependencies (tự động chạy prisma generate)
npm install

# 3. Cấu hình environment (IMPORTANT: xem chi tiết bên dưới)
cp .env.example .env.local
# Chỉnh sửa .env.local với thông tin thật

# 4. Khởi động PostgreSQL + Mailpit (cho email testing)
docker compose up -d

# 5. Chạy migrations
npx prisma migrate dev

# 6. Seed demo data (tùy chọn)
npx prisma db seed

# 7. Khởi động development server
npm run dev
# → http://localhost:3000
```

**⚠️ QUAN TRỌNG:** Đừng bỏ qua bước cấu hình `.env.local` - xem [Environment Configuration](#-environment-configuration) bên dưới.

---

## 📋 Prerequisites

### Required
| Tool | Version | Purpose | Installation |
|------|---------|---------|-------------|
| Node.js | 20+ | Runtime | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Package manager | Comes with Node.js |
| Docker | 24+ | Database & Mailpit | [docker.com](https://docker.com) |
| Git | 2+ | Version control | [git-scm.com](https://git-scm.com) |

### Recommended
| Tool | Purpose |
|------|---------|
| VS Code | Code editor |
| Postman/Insomnia | API testing |
| pgAdmin/TablePlus | Database GUI |
| Mailpit | Email testing UI |

### Verify Installation

```bash
# Check Node.js version
node --version  # Must be v20.x or higher

# Check npm version
npm --version    # Must be 9.x or higher

# Check Docker
docker --version
docker compose version

# Check Git
git --version
```

---

## 🌍 Environment Configuration

### File Structure

```
.env                    # Default config (don't modify)
.env.example           # Template for new environments
.env.local            # Local overrides (gitignored)
.env.production       # Production config (server)
```

**Note:** `.env.local` được ignore bởi Git - đây là nơi đặt các secrets và config cá nhân.

### Required Variables

Tạo `.env.local` từ `.env.example`:

```bash
cp .env.example .env.local
```

#### 🔴 CRITICAL (Phải cấu hình đúng)

| Variable | Description | Example | How to Generate |
|----------|-------------|---------|-----------------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://treclone:treclone123@localhost:5432/treclone` | See Docker section |
| `JWT_SECRET` | JWT signing secret | `your-64-char-base64-secret-here` | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | App URL | `http://localhost:3000` | - |
| `EMAIL_FROM` | Sender email | `noreply@treclone.local` | - |

#### 🟡 Important (Cho development)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_BASE_URL` | Fallback base URL | `http://localhost:3000` |
| `SMTP_HOST` | Mailpit host | `localhost` |
| `SMTP_PORT` | Mailpit port | `1025` |
| `SMTP_USER` | Mailpit user | (leave empty) |
| `SMTP_PASS` | Mailpit pass | (leave empty) |
| `SMTP_SECURE` | Use TLS? | `false` |

#### 🟢 Optional (Production)

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | Resend email API | `re_xxxxxxxxx` |
| `GOOGLE_CLIENT_ID` | Google OAuth | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | `xxx` |
| `GITHUB_CLIENT_ID` | GitHub OAuth | `xxx` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth secret | `xxx` |

### Generate JWT Secret

```bash
# Generate a 32-byte (64 char base64) secret
openssl rand -base64 32

# Or for hex
openssl rand -hex 32

# Copy output and paste into JWT_SECRET in .env.local
```

### Database Configuration

Repository dùng PostgreSQL 17 thông qua Docker. Cấu hình mặc định trong `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:17
    container_name: treclone-db
    environment:
      POSTGRES_USER: treclone
      POSTGRES_PASSWORD: treclone123
      POSTGRES_DB: treclone
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

**DATABASE_URL format:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

Ví dụ cho local development:
```
postgresql://treclone:treclone123@localhost:5432/treclone?schema=public
```

---

## 🐳 Docker Setup

### Start Containers

```bash
# Start all services (PostgreSQL + Mailpit)
docker compose up -d

# View running containers
docker compose ps

# View logs
docker compose logs -f
```

### Services

| Service | Port | Purpose | URL |
|---------|------|---------|-----|
| PostgreSQL | 5432 | Database | - |
| Mailpit | 1025, 8025 | Email testing | [http://localhost:8025](http://localhost:8025) |

### Mailpit (Email Testing)

Mailpit là SMTP server local cho testing email:
- **SMTP Port:** 1025
- **Web UI:** [http://localhost:8025](http://localhost:8025)
- **Purpose:** Xem tất cả email được gửi (đăng ký, reset password, v.v.)

Khi chạy `npm run dev`, tất cả email sẽ được gửi đến Mailpit thay vì SMTP server thật.

### Stop Containers

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (xóa hết data)
docker compose down -v
```

---

## 🗄️ Database Management

### Prisma Commands

```bash
# Generate Prisma client (auto-run on npm install)
npx prisma generate

# Apply migrations
npx prisma migrate dev

# Apply migrations in production
npx prisma migrate deploy

# Create new migration (sau khi thay đổi schema)
npx prisma migrate dev --name add_due_date_to_cards

# Rollback migration (nếu lỡ tạo sai)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio

# Seed database with demo data
npx prisma db seed
```

### Database Schema

Schema được định nghĩa trong `prisma/schema.prisma`. Sau khi thay đổi schema:

1. Chạy `npx prisma migrate dev --name <migration_name>`
2. Commit cả schema và migration files

**⚠️ QUAN TRỌNG:** Không bao giờ edit migrations trong `prisma/migrations/` bằng tay.

### Seed Data

Demo data được định nghĩa trong `prisma/seed.ts`. Chạy:

```bash
npx prisma db seed
```

Seed sẽ tạo:
- 1 user (admin@treclone.local / password)
- 1 workspace
- 1 board
- 3 lists (To Do, In Progress, Done)
- 6 cards (2 cards mỗi list)

### Reset Database

```bash
# Cách 1: Reset hoàn toàn (xóa hết data)
npx prisma migrate reset

# Cách 2: Xóa data nhưng giữ schema
npx prisma db execute --file ./prisma/scripts/truncate.sql

# Cách 3: Dùng Docker (xóa hết container + volume)
docker compose down -v
docker compose up -d
npx prisma migrate dev
npx prisma db seed
```

---

## 🏃 Development Workflow

### Daily Workflow

```bash
# 1. Pull latest changes
git pull origin dev

# 2. Install dependencies (nếu có package.json thay đổi)
npm install

# 3. Apply pending migrations (nếu có schema thay đổi)
npx prisma migrate dev

# 4. Start dev server
npm run dev
```

### Feature Development (Theo AGENTS.md)

Theo [AGENTS.md](./AGENTS.md), phát triển theo **Vertical Slices + TDD**:

```
1. RED Phase: Viết test thất bại
   ├── Viết unit test cho domain logic
   ├── Viết integration test cho API endpoint
   └── Viết component test cho UI

2. GREEN Phase: Viết code để test pass
   ├── Cập nhật Domain Model (Prisma schema)
   ├── Viết/Update Repository layer
   ├── Viết/Update Service layer
   ├── Viết/Update Controller layer
   ├── Viết/Update Route handler
   └── Dựng UI component nối API

3. REFACTOR Phase: Tối ưu
   ├── npm run lint
   ├── npm run test:all
   └── Optimize code
```

Xem [TESTING.md](./TESTING.md) để biết chi tiết về testing strategy.

### Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code with Prettier |
| `npm run test:unit` | Run unit tests |
| `npm run test:integration` | Run integration tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:all` | Run all tests |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Apply migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed demo data |

---

## 🔧 Development Tools

### Hot Reload

Next.js 15 hỗ trợ hot reload:
- **File changes:** Auto-reload browser
- **API route changes:** Auto-reload API
- **Config changes:** Restart dev server

### Debugging

#### Debug Node.js (Backend)

Thêm vào `launch.json` trong VS Code:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Next.js",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

Chạy debug mode:
1. Mở VS Code
2. F5 hoặc click Run > Start Debugging
3. Chọn "Debug Next.js"

#### Debug Tests

```bash
# Debug unit tests
node --inspect-brk -r tsx node_modules/vitest/vitest.mjs run tests/unit/services/card.service.test.ts

# Debug integration tests
node --inspect-brk -r tsx node_modules/vitest/vitest.mjs run --mode integration tests/integration/api/cards.test.ts
```

#### Console Logging

**⚠️ QUAN TRỌNG:** Theo [CONTRIBUTING.md](./CONTRIBUTING.md), không bao giờ commit `console.log`. Dùng:

```typescript
// ✅ GOOD - cho development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}

// ✅ BETTER - dùng debug package
import debug from 'debug'
const log = debug('treclone:service')
log('Processing card:', cardId)

// ✅ BEST - dùng logger service
import { logger } from '@/lib/utils/logger'
logger.debug('Card moved', { cardId, fromList, toList })

// ❌ BAD - không bao giờ commit
console.log('User created:', user)
```

### Code Formatting

```bash
# Format tất cả files
npx prettier --write .

# Check formatting
npx prettier --check .

# Format specific file
npx prettier --write src/lib/services/card.service.ts
```

Cấu hình trong `.prettierrc`:
- Single quotes
- 2-space indent
- Trailing commas
- Semicolons

### Linting

```bash
# Check linting
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Check specific file
npx eslint src/lib/services/card.service.ts
```

Cấu hình trong `eslint.config.mjs`:
- TypeScript strict mode
- Next.js recommended rules
- Prettier compatibility

---

## 📁 Project Structure

Xem [ARCHITECTURE.md](./ARCHITECTURE.md) cho chi tiết về kiến trúc. Dưới đây là cấu trúc thư mục chính:

```
treclone/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth pages (login, register, etc.)
│   │   ├── (dashboard)/       # Protected pages
│   │   │   └── workspaces/    # Workspace context
│   │   │       └── [workspaceId]/
│   │   │           ├── boards/ # Board pages
│   │   │           │   └── [boardId]/
│   │   │           │       ├── _components/ # Board-specific components
│   │   │           │       ├── cards/ # Card detail pages
│   │   │           │       └── edit/ # Board settings
│   │   │           └── settings/ # Workspace settings
│   │   └── api/               # API route handlers
│   │       └── **/route.ts
│   │
│   ├── components/            # React components
│   │   ├── ui/               # shadcn primitives
│   │   └── dashboard/        # App-specific components
│   │
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx
│   │
│   ├── hooks/                # Feature hooks
│   │   ├── auth/
│   │   ├── boards/
│   │   ├── cards/
│   │   └── ...
│   │
│   └── lib/                  # Core logic (4-layer architecture)
│       ├── controllers/     # HTTP request/response handling
│       ├── services/        # Business logic
│       ├── repositories/    # Database access
│       ├── validation/      # Zod schemas
│       ├── utils/           # Shared utilities
│       └── db/              # Prisma client
│
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Migration history
│   └── seed.ts              # Demo data
│
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── utils/
│
├── design-system/           # Design system documentation
│   └── MASTER.md
│
└── docs/                    # Additional documentation
    ├── architecture/
    └── development/
```

---

## 🌐 Network & Ports

| Service | Port | Protocol | URL |
|---------|------|-----------|-----|
| Next.js Dev | 3000 | HTTP | [http://localhost:3000](http://localhost:3000) |
| PostgreSQL | 5432 | TCP | - |
| Mailpit SMTP | 1025 | TCP | - |
| Mailpit Web | 8025 | HTTP | [http://localhost:8025](http://localhost:8025) |

---

## 🔄 Branching Strategy

Xem [CONTRIBUTING.md](./CONTRIBUTING.md) cho chi tiết. Tóm tắt:

```
main (stable)
  └── dev (integration)
      ├── feat/authentication
      ├── feat/board-management
      ├── feat/card-details
      └── fix/bug-name
```

**Rules:**
- Tất cả feature branches dựa trên `dev`
- Tên branch: `feat/<topic>` hoặc `fix/<topic>`
- Sau khi review, merge vào `dev` (squash or rebase)
- `main` chỉ update qua releases

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Docker Container Won't Start

```bash
# Check if port 5432 is in use
netstat -ano | findstr 5432

# Kill process using port 5432
# (Windows)
taskkill /PID <PID> /F

# (Mac/Linux)
kill -9 <PID>

# Restart Docker
docker compose down
docker compose up -d
```

#### 2. Database Connection Failed

```bash
# Verify Docker containers are running
docker compose ps

# Check database logs
docker compose logs postgres

# Test connection manually (using psql)
docker exec -it treclone-db psql -U treclone -d treclone

# Verify .env.local has correct DATABASE_URL
cat .env.local | grep DATABASE_URL
```

#### 3. Prisma Generate Failed

```bash
# Delete generated client
rm -rf prisma/generated

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate client
npx prisma generate
```

#### 4. Tests Failing

```bash
# Run tests with verbose output
npx vitest run --reporter=verbose

# Run specific test file
npx vitest run tests/unit/services/card.service.test.ts

# Check Docker database for integration tests
docker exec -it treclone-db psql -U treclone -d treclone
```

#### 5. Port 3000 Already in Use

```bash
# Find process using port 3000
netstat -ano | findstr 3000

# Kill the process
# (Windows)
taskkill /PID <PID> /F

# (Mac/Linux)
kill -9 <PID>

# Try different port
NEXT_PUBLIC_APP_URL=http://localhost:3001 npm run dev
```

#### 6. JWT Token Issues

```bash
# Verify JWT_SECRET is set in .env.local
echo $JWT_SECRET

# Generate new secret
openssl rand -base64 32

# Update .env.local and restart server
```

#### 7. Email Not Sending

```bash
# Check Mailpit Web UI
# [http://localhost:8025](http://localhost:8025)

# Verify SMTP config in .env.local
cat .env.local | grep SMTP

# Test SMTP connection manually
telnet localhost 1025
```

---

## 💡 Development Tips

### 1. TypeScript

- **Strict mode** được bật - không dùng `any`
- **Path aliases** được cấu hình: `@/*` → `src/*`, `@generated/client` → Prisma client
- **Type checking:** `npm run build` includes type-check

```typescript
// ✅ GOOD - Type safe
import type { User } from '@generated/client'

// ❌ BAD - Avoid any
const user: any = await getUser()
```

### 2. API Development

- **Always use `withMiddleware`** cho protected routes
- **Validate input** với Zod schemas
- **Handle errors** với `AppError` và `handleError`

```typescript
// ✅ GOOD - Full validation and error handling
import { withMiddleware } from '@/lib/utils/with-middleware'
import { createCardSchema } from '@/lib/validation/card.schema'
import { handleError } from '@/lib/utils/errors'

export const POST = withMiddleware(async (request, context) => {
  try {
    const body = await request.json()
    const data = createCardSchema.parse(body)
    const result = await cardService.createCard(data)
    return successResponse(result)
  } catch (error) {
    return handleError(error)
  }
})
```

### 3. Database Operations

- **Không bao giờ** query Prisma trực tiếp từ route/controller
- **Luôn** đi qua Repository → Service → Controller

```typescript
// ✅ GOOD - Through repository
const card = await cardRepository.findById(cardId)

// ❌ BAD - Direct Prisma in route
import { prisma } from '@/lib/db/prisma'
const card = await prisma.card.findUnique({ where: { id: cardId } })
```

### 4. React Components

- **Use TanStack Query** cho data fetching
- **Optimistic updates** cho mutations
- **Error boundaries** cho error handling

```tsx
// ✅ GOOD - Optimistic update
const { mutate: createCard } = useCreateCard({
  onMutate: async (newCard) => {
    await queryClient.cancelQueries(['cards', listId])
    const previousCards = queryClient.getQueryData(['cards', listId])
    queryClient.setQueryData(['cards', listId], (old: Card[]) => [
      ...old, 
      { ...newCard, id: 'temp' }
    ])
    return { previousCards }
  },
  onError: (err, newCard, context) => {
    queryClient.setQueryData(['cards', listId], context?.previousCards)
  },
  onSettled: () => {
    queryClient.invalidateQueries(['cards', listId])
  }
})
```

---

## 📚 Learning Resources

### Next.js 15 (App Router)
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

### Prisma
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/concepts/components/prisma-client)
- [Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

### Testing
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [MSW (Mock Service Worker)](https://mswjs.io/)

### UI/UX
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

---

## 🔗 Related Documentation

| Document | Purpose |
|----------|---------|
| [AGENTS.md](./AGENTS.md) | Agent workflow & TDD requirements |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture & layers |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Development workflow & PR process |
| [TESTING.md](./TESTING.md) | Testing strategy & guidelines |
| [DESIGN.md](./DESIGN.md) | Design system & UI conventions |
| [REVIEW.md](./REVIEW.md) | Current state & implementation plan |
| [design-system/MASTER.md](./design-system/MASTER.md) | Complete design system specs |

---

## 📝 Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-08-20 | Initial release - Complete development guide |

---

## 🆘 Need Help?

### Frequently Asked Questions

**Q: Làm sao để reset database hoàn toàn?**
A: Chạy `docker compose down -v && docker compose up -d && npx prisma migrate dev && npx prisma db seed`

**Q: Làm sao để debug API route?**
A: Thêm `console.log` tạm thời (nhớ xóa trước khi commit) hoặc dùng VS Code debug configuration.

**Q: Làm sao để test email functionality?**
A: Mở [http://localhost:8025](http://localhost:8025) để xem tất cả email được gửi qua Mailpit.

**Q: Tại sao test integration bị fail?**
A: Đảm bảo Docker containers đang chạy (`docker compose ps`) và database connection trong `.env.local` là đúng.

**Q: Làm sao để thêm dependency mới?**
A: Chạy `npm install <package>`, sau đó commit cả `package.json` và `package-lock.json`.

### Contact

- **GitHub Issues:** [github.com/Sleeplessmen/Treclone/issues](https://github.com/Sleeplessmen/Treclone/issues)
- **Label:** Dùng `label:help` cho câu hỏi development

---

**Happy Coding!** 🚀  

*Maintained by Treclone Engineering Team*
