import { describe, test, expect } from 'vitest'
import fixtures from './fixtures'
import { authAs, getData, successStatuses, DEFAULT_TEST_PASSWORD } from './test-utils'

const TEST_PASSWORD = DEFAULT_TEST_PASSWORD

const getTs = () => `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

describe('E2E Workspace Tests', () => {
    test('TC07 — Tạo mới một Không gian làm việc (Workspace) thành công', async () => {
        const ts = getTs()
        const email = `qa+ws.${ts}@example.com`
        const cookieHeader = await authAs(email)

        const res = await fixtures.createWorkspace(cookieHeader, {
            name: `ws-qa-${ts}`,
            description: 'E2E workspace',
        })
        const data = getData<{ workspace?: { id?: string | number } }>(res.body)

        expect(successStatuses()).toContain(res.status)
        expect(data?.workspace?.id).toBeDefined()
    })

    test('TC08 — Tạo Workspace thất bại do bỏ trống các trường bắt buộc', async () => {
        const ts = getTs()
        const email = `qa+ws2.${ts}@example.com`
        const cookieHeader = await authAs(email)

        const res = await fixtures.createWorkspace(cookieHeader, { name: '' })

        expect([400, 500]).toContain(res.status)
    })

    test('TC09 — Cập nhật thông tin Workspace (Đổi tên, mô tả)', async () => {
        const ts = getTs()
        const email = `qa+ws.update.${ts}@example.com`
        const cookieHeader = await authAs(email)

        const createRes = await fixtures.createWorkspace(cookieHeader, {
            name: `ws-qa-${ts}`,
            description: 'Initial desc',
        })
        const createdData = getData<{ workspace?: { id?: string | number } }>(createRes.body)

        expect(successStatuses()).toContain(createRes.status)

        const workspaceId = createdData?.workspace?.id
        expect(workspaceId).toBeDefined()

        const newName = `ws-updated-${ts}`
        const newDesc = 'Updated description'

        const updateRes = await fixtures.updateWorkspace(cookieHeader, workspaceId!, {
            name: newName,
            description: newDesc,
        })
        const updatedData = getData<{ workspace?: { name?: string; description?: string } }>(updateRes.body)

        expect(successStatuses()).toContain(updateRes.status)
        expect(updatedData?.workspace?.name).toBe(newName)
        expect(updatedData?.workspace?.description).toBe(newDesc)
    })

    test('TC10 — Mời thành viên mới tham gia vào Workspace thông qua Email', async () => {
        const ts = getTs()
        const ownerEmail = `owner+ws.${ts}@example.com`
        const memberEmail = `member+ws.${ts}@example.com`

        await fixtures.createUser(memberEmail, TEST_PASSWORD)
        const cookieHeader = await authAs(ownerEmail)

        const createRes = await fixtures.createWorkspace(cookieHeader, {
            name: `ws-invite-${ts}`,
            description: 'Invite test',
        })
        const createdData = getData<{ workspace?: { id?: string | number } }>(createRes.body)

        expect(successStatuses()).toContain(createRes.status)

        const workspaceId = createdData?.workspace?.id
        expect(workspaceId).toBeDefined()

        const inviteRes = await fixtures.inviteWorkspaceMember(cookieHeader, workspaceId!, {
            email: memberEmail,
            role: 'member',
        })
        const invitedData = getData<{ member?: { user?: { email?: string } } }>(inviteRes.body)

        expect(successStatuses()).toContain(inviteRes.status)
        expect(invitedData?.member?.user?.email).toBe(memberEmail)

        const membersRes = await fixtures.listWorkspaceMembers(cookieHeader, workspaceId!)
        const membersData = getData<{ members?: Array<{ user?: { email?: string } }> }>(membersRes.body)

        expect(membersRes.status).toBe(200)

        const members = membersData?.members || []
        const found = members.find((m: { user?: { email?: string } }) => m.user?.email === memberEmail)

        expect(found).toBeDefined()
    })
})
