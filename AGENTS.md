# AGENTS.md - Treclone Agent Workflow Protocol

**Version:** 1.0  
**Last Updated:** 2026-08-20  
**Status:** ACTIVE - Mandatory for all Agent sessions  
**Related:** [TESTING.md](./TESTING.md), [DEVELOPMENT.md](./DEVELOPMENT.md), [REVIEW.md](./REVIEW.md)

---

## 🎯 TỔNG QUAN: 5 GIAI ĐOẠN PHÁT TRIỂN

```
[GĐ 1: Thiết lập Luật & Feedback Loops] ✅ COMPLETE
   └── Tạo Rules, Tooling, Linters, Test Runners

[GĐ 2: UI Prototyping & Tài liệu hóa Design System] ✅ COMPLETE
   └── Throwaway Prototypes → Chốt Style → MCP / Design Tokens Doc

[GĐ 3: Định hình Khung Kiến trúc DDD & Module Boundaries] ✅ COMPLETE
   └── Tổ chức thư mục Skeleton (Core Domain, Application, Infra, UI)

[GĐ 4: Thực thi từng Lát cắt dọc (Vertical Slices + TDD + AFK Loop)] 🟡 IN PROGRESS (70%)
   └── Slice 1 (Auth/Workspace) → Slice 2 (Board/List) → Slice 3 (Card Core)...

[GĐ 5: Review độc lập, QA Gu thẩm mỹ & Xóa bỏ Doc Rot] ⏳ PENDING
```

**Current State:** 70% Complete (xem REVIEW.md cho chi tiết)

---

## 📜 QUY TẮC BẤT DI BẤT DỊCH (CRITICAL INSTRUCTIONS)

### 1.luật Push (Chuẩn coding cho Reviewer)
- ✅ **Luôn chạy** `npm run lint` trước khi commit
- ✅ **Luôn chạy** `npm run test:all` trước khi push
- ✅ **Luôn** viết test cho behavior mới (TDD mandatory)
- ✅ **Luôn** cập nhật documentation khi thay đổi kiến trúc
- ✅ **Luôn** dùng type safety (không `any`, dùng `z.infer<>`)

### 2. Luật Pull (Hướng dẫn cho Implementer)
- ✅ **Đọc** AGENTS.md, ARCHITECTURE.md, DESIGN.md TRƯỚC KHI CODE
- ✅ **Tuân thủ** 4-layer backend: Route → Controller → Service → Repository
- ✅ **Không bao giờ** query Prisma trực tiếp từ route/controller
- ✅ **Luôn** dùng `withMiddleware` cho protected routes
- ✅ **Luôn** validate input với Zod schema

### 3. Cấu trúc Code FE (Clean Components)
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login, Register, Verify Email
│   ├── (dashboard)/        # Protected routes
│   │   └── workspaces/     # Workspace context
│   │       └── [workspaceId]/boards/[boardId]/ # Board context
│   └── api/                # REST endpoints
│       └── **/route.ts     # Route handlers
├── components/
│   ├── ui/                # shadcn primitives (Button, Modal, Card...)
│   └── dashboard/          # App-specific components
├── hooks/                  # Feature hooks (useQuery/useMutation)
│   ├── auth/
│   ├── boards/
│   ├── cards/
│   └── ...
├── lib/
│   ├── controllers/        # HTTP logic
│   ├── services/          # Business logic
│   ├── repositories/      # Database access
│   ├── validation/        # Zod schemas
│   └── utils/             # Shared utilities
└── contexts/              # React contexts
```

### 4. Cấu trúc Code BE (DDD Layers)
```
src/lib/
├── controllers/           # Parse requests, build responses
├── services/             # Business rules, authorization
├── repositories/         # Pure Prisma queries
└── db/                   # Prisma client singleton

Request Flow:
Route Handler → withMiddleware → Controller → Service → Repository → Prisma → Postgres
```

---

## 🛠️ FEEDBACK LOOPS (Bắt buộc cho TDD & AFK)

### CLI Commands (Phải chạy được tức thì)

Xem chi tiết trong [DEVELOPMENT.md](./DEVELOPMENT.md#-common-commands)

```bash
# Linting
npm run lint                    # ESLint (must pass)
npx prettier --write .         # Formatting

# Type Check
npm run build                   # Next.js build (includes type-check)

# Testing (xem [TESTING.md](./TESTING.md) cho chi tiết)
npm run test:unit              # Unit tests (jsdom, no DB)
npm run test:integration       # Integration tests (needs Docker DB)
npm run test:e2e              # E2E tests
npm run test:all              # Run all tests (REQUIRED before push)

# Development (xem [DEVELOPMENT.md](./DEVELOPMENT.md) cho chi tiết)
npm run dev                    # Next.js dev server
npm run db:generate            # Generate Prisma client
npm run db:migrate            # Run migrations
```

### TDD Vòng lặp (Red-Green-Refactor)

Xem chi tiết trong [TESTING.md](./TESTING.md#-tdd-workflow)

1. **RED**: Viết test thất bại
2. **GREEN**: Viết code để test pass
3. **REFACTOR**: Tối ưu code, giữ test xanh

---

## 🎨 GIAI ĐOẠN 2: DESIGN SYSTEM (Đã hoàn thành)

### Design Tokens (DESIGN.md)
- **Colors**: canvas, surface-1, surface-2, primary, on-primary, ink, ink-muted
- **Typography**: Manrope (headlines), Inter (body)
- **Rounded**: sm(6px), md(12px), lg(16px), full(9999px)
- **Spacing**: gap-xs(4px), gap-sm(8px), gap-md(16px), gap-lg(24px), gap-xl(32px)

### Quy tắc bất di bất dịch
- ❌ **NO-LINE RULE**: Không dùng `border: 1px solid` để chia cột
- ❌ **No Shadow Rule**: Không đổ bóng vô tội vạ
- ❌ **No Pure Black**: Luôn dùng `{colors.ink}` thay vì `#000000`
- ✅ **Tonal Stacking**: Ranh giới bằng sự thay đổi màu nền
- ✅ **Glassmorphism**: Dùng cho modal và trạng thái hover

### Atomic Components
- Button (primary, secondary, ghost)
- Modal, Card, Dropdown, Avatar
- Input, Select, Checkbox
- StatusChip, Badge

---

## 🏗️ GIAI ĐOẠN 3: DDD ARCHITECTURE (Đã hoàn thành)

### Backend Layers (4-layer split)

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Route Handlers | `src/app/api/**/route.ts` | HTTP verbs, dynamic segments |
| Controllers | `src/lib/controllers/*.ts` | Parse requests, build NextResponse |
| Services | `src/lib/services/*.ts` | Business rules, validation, auth checks |
| Repositories | `src/lib/repositories/*.ts` | Pure Prisma queries (NO HTTP/NO policy) |

### Frontend Structure
```
src/
├── app/(dashboard)/workspaces/[workspaceId]/boards/[boardId]/
│   ├── _components/          # Board-specific components
│   │   ├── kanban-board.tsx  # Main DnD board
│   │   ├── kanban-list.tsx   # List with cards
│   │   └── kanban-card.tsx   # Card component
│   └── cards/
│       └── _components/      # Card detail components
└── hooks/<feature>/          # Feature-specific hooks
```

### Module Boundaries (Deep Modules)
- Mỗi feature có thư mục riêng: `boards/`, `cards/`, `lists/`, `workspaces/`
- Mỗi module có: controller, service, repository, validation
- Tránh shallow modules (quá nhiều file vụn vặt phụ thuộc chéo)

---

## ⚔️ GIAI ĐOẠN 4: VERTICAL SLICES + TDD + AFK LOOP

### ⚠️ CẢNH BÁO: KHÔNG viết toàn bộ Backend trước rồi mới làm Frontend!
**Phải đi từng tính năng xuyên suốt:** Domain Model/DB → API → UI Component

### Current Progress (70% Complete)

#### ✅ HOÀN THÀNH
- Slice 1: Authentication & Workspace Basics
  - JWT Auth (login, register, logout, password reset, email verification)
  - Workspace CRUD
  - Middleware (auth, rate limiting, correlation ID)

- Slice 2: Board & List Management
  - Board CRUD
  - List CRUD + DnD reorder
  - BoardMember management

- Slice 3: Card Core
  - Card CRUD
  - Card DnD (move between lists, reorder within list)
  - CardComment

#### 🟡 ĐANG THIẾU (Thứ tự ưu tiên)

**Slice 3 (Card Details) - HIGH PRIORITY:**
- [ ] Due date picker & status
- [ ] Labels with color selector
- [ ] Checklist with progress
- [ ] Attachments (file upload)
- [ ] CardActivity feed
- [ ] @Mention parsing in comments

**Slice 4 (Permissions) - HIGH PRIORITY:**
- [ ] System roles (SYSTEM_ADMIN, USER)
- [ ] Workspace roles (OWNER, ADMIN, MEMBER)
- [ ] Board roles (ADMIN, EDITOR, VIEWER)
- [ ] Permission middleware

**Slice 5 (OAuth2) - HIGH PRIORITY:**
- [ ] Google OAuth
- [ ] GitHub OAuth
- [ ] Session management
- [ ] Change password

**Slice 6 (Notifications) - HIGH PRIORITY:**
- [ ] Notification model
- [ ] Card assignment notifications
- [ ] Mention notifications
- [ ] Due date reminders
- [ ] Email notification service

**Slice 7 (Realtime Sync) - HIGH PRIORITY:**
- [ ] Socket.IO server setup
- [ ] WebSocket connection
- [ ] Broadcast card moves
- [ ] Broadcast comments
- [ ] Presence indicators

**Slice 8 (Search & Filter) - MEDIUM PRIORITY:**
- [ ] Global search API
- [ ] Search UI
- [ ] Filter by label, assignee, due date

**Slice 9 (Analytics) - MEDIUM PRIORITY:**
- [ ] Stats API endpoints
- [ ] Chart components (PieChart, BarChart)
- [ ] Dashboard page

**Slice 10 (Polish) - MEDIUM PRIORITY:**
- [ ] Board background customization
- [ ] Board privacy settings
- [ ] Invite link generation

### AFK TDD Execution Loop (Mỗi Slice)

```
Step 1 (RED):
├── Viết unit test thất bại cho Domain logic
├── Viết integration test thất bại cho API endpoint
└── Viết component test thất bại cho UI

Step 2 (GREEN):
├── Cập nhật Domain Model (Prisma schema)
├── Viết/Update Repository layer
├── Viết/Update Service layer (business logic)
├── Viết/Update Controller layer (HTTP logic)
├── Viết/Update Route handler
└── Dựng UI component nối API

Step 3 (REFACTOR):
├── Chạy type-check (tsc --noEmit)
├── Chạy lint (npm run lint)
├── Chạy tất cả tests (npm run test:all)
├── Tối ưu code
└── Clear context nếu gần chạm 100k token

Step 4 (VERIFY):
├── Manual test trên browser
├── Kiểm tra trải nghiệm người dùng
└── Chụp màn hình cho documentation
```

### Vertical Slice Example: Card Due Date

```
1. RED Phase:
   - tests/unit/card.service.test.ts: test due date calculation
   - tests/integration/card.controller.test.ts: test PATCH /api/cards/[id]/due-date
   - tests/unit/due-date-picker.test.tsx: test DueDatePicker component

2. GREEN Phase:
   - prisma/schema.prisma: add dueDate field to Card model
   - src/lib/repositories/card.repository.ts: add updateDueDate
   - src/lib/services/card.service.ts: add updateDueDate logic
   - src/lib/controllers/card.controller.ts: add dueDate handler
   - src/app/api/cards/[cardId]/due-date/route.ts: new endpoint
   - src/components/cards/due-date-picker.tsx: new component
   - src/hooks/cards/mutations.ts: add useUpdateDueDate

3. REFACTOR Phase:
   - Run npm run test:all
   - Run npm run lint
   - Optimize queries
   - Add indexes to DB

4. VERIFY Phase:
   - Manual test on UI
   - Add to REVIEW.md
```

---

## 🎭 GIAI ĐOẠN 5: REVIEW ĐỘC LẬP & QA

### Automated Clean Review
1. Tạo branch mới từ `dev`
2. Nạp branch/commit vừa hoàn thành
3. Dùng model mạnh hơn (Opus/Claude) review độc lập
4. Checklist:
   - [ ] Code tuân thủ ARCHITECTURE.md
   - [ ] All tests pass
   - [ ] No linting errors
   - [ ] Type safety maintained
   - [ ] No `any` types
   - [ ] Proper error handling

### Human QA & Áp đặt Taste
1. Con người trải nghiệm trực tiếp
2. Kiểm tra flow thực tế
3. Phát sinh lỗi/thiếu sót → Thêm Issue vào Kanban
4. Chuyển tiếp cho Agent chạy loop

### Dọn dẹp (Doc Rot Prevention)
1. Đóng (close) các issue/PRD tạm thời
2. Xóa bỏ mock data/throwaway prototype
3. Xóa file rác cũ không dùng tới
4. Cập nhật documentation

---

## 📋 CHECKLIST TRƯỚC KHI PUSH

- [ ] `npm run lint` passes
- [ ] `npm run test:all` passes (xem [TESTING.md](./TESTING.md))
- [ ] TypeScript compiles without errors
- [ ] New/changed behavior has tests (bắt buộc theo [TESTING.md](./TESTING.md))
- [ ] Database migrations committed (if schema changed)
- [ ] Environment variables in `.env.example`
- [ ] README/ARCHITECTURE updated (if relevant)
- [ ] No `any` types introduced
- [ ] No console.log/debug statements
- [ ] Proper error handling with AppError
- [ ] Input validation with Zod
- [ ] Rate limiting applied to new API routes
- [ ] Auth middleware applied to protected routes

---

## 🚀 NEXT STEPS (Ưu tiên cao)

### Immediate (Fix Critical Issues)

Xem chi tiết trong [DEVELOPMENT.md](./DEVELOPMENT.md#-environment-configuration)

1. Generate JWT_SECRET: `openssl rand -base64 32` (xem [DEVELOPMENT.md](./DEVELOPMENT.md#generate-jwt-secret))
2. Configure database credentials in `.env.local` (xem [DEVELOPMENT.md](./DEVELOPMENT.md#-environment-configuration))
3. Run `docker compose up -d` for PostgreSQL (xem [DEVELOPMENT.md](./DEVELOPMENT.md#-docker-setup))
4. Run `npx prisma migrate dev` (xem [DEVELOPMENT.md](./DEVELOPMENT.md#-database-management))

### High Priority (Week 1-2)
1. **Permissions System**
   - Define role enums (SystemRole, WorkspaceRole, BoardRole)
   - Update Prisma schema to use enums
   - Create permission middleware
   - Apply to existing routes

2. **OAuth2**
   - Add @react-oauth/google, next-auth
   - Create Google OAuth endpoint
   - Create GitHub OAuth endpoint
   - Update login UI

3. **Card Details**
   - Add dueDate, labels to Card model
   - Create Checklist, Attachment models
   - Implement checklist with progress
   - Implement file upload for attachments

### High Priority (Week 3-4)
1. **Notifications**
   - Create Notification model
   - Implement notification triggers
   - Create notification UI
   - Email notification service

2. **Realtime Sync**
   - Setup Socket.IO server
   - Implement WebSocket connection
   - Broadcast realtime updates
   - Presence indicators

### Medium Priority (Week 5-6)
1. **Search & Filter**
2. **Analytics Dashboard**
3. **Board Customization** (background, privacy)

---

## 📚 TÀI LIỆU THAM KHẢO

### Core Documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Kiến trúc chi tiết
- [DESIGN.md](./DESIGN.md) - Hệ thống thiết kế
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Quy tắc đóng góp
- [REVIEW.md](./REVIEW.md) - Trạng thái hiện tại & kế hoạch

### Development & Testing
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Hướng dẫn setup & development workflow
- [TESTING.md](./TESTING.md) - Chiến lược testing & best practices
- [design-system/MASTER.md](./design-system/MASTER.md) - Design system specifications

---

**Generated by:** Mistral Vibe  
**Co-Authored-By:** Mistral Vibe <vibe@mistral.ai>
