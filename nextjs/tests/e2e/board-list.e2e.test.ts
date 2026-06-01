import { describe, test, expect } from 'vitest'
import fixtures from './fixtures'
import { authAs, getData, successStatuses, DEFAULT_TEST_PASSWORD } from './test-utils'

const ts = Date.now()
const TEST_PASSWORD = DEFAULT_TEST_PASSWORD

describe('E2E Board & List Tests', () => {
    test('TC11 - create board in workspace', async () => {
        const cookieHeader = await authAs(`qa+board1.${ts}@example.com`, TEST_PASSWORD)

        const ws = await fixtures.createWorkspace(cookieHeader, { name: `ws-board-${ts}` })
        const wsId = getData<{ workspace?: { id?: string | number } }>(ws.body)?.workspace?.id
        expect(wsId).toBeDefined()

        const res = await fixtures.createBoard(cookieHeader, wsId!, { title: `Board ${ts}` })
        expect(successStatuses()).toContain(res.status)
    })

    test('TC12 - create list on board', async () => {
        const cookieHeader = await authAs(`qa+board2.${ts}@example.com`, TEST_PASSWORD)

        const ws = await fixtures.createWorkspace(cookieHeader, { name: `ws-board-${ts}` })
        const wsId = getData<{ workspace?: { id?: string | number } }>(ws.body)?.workspace?.id
        expect(wsId).toBeDefined()

        const board = await fixtures.createBoard(cookieHeader, wsId!, { title: `Board ${ts}` })
        const boardId = getData<{ board?: { id?: string | number } }>(board.body)?.board?.id
        expect(boardId).toBeDefined()

        const res = await fixtures.createList(cookieHeader, wsId!, boardId!, { title: `List ${ts}` })
        expect(successStatuses()).toContain(res.status)

        const list = getData<{ list?: { title?: string; name?: string } }>(res.body)?.list
        expect(list).toBeDefined()
        expect(list?.title || list?.name).toBeDefined()
    })

    test('TC13 - reorder lists on board', async () => {
        const cookieHeader = await authAs(`qa+board3.${ts}@example.com`, TEST_PASSWORD)

        const ws = await fixtures.createWorkspace(cookieHeader, { name: `ws-board-${ts}` })
        const wsId = getData<{ workspace?: { id?: string | number } }>(ws.body)?.workspace?.id
        expect(wsId).toBeDefined()

        const board = await fixtures.createBoard(cookieHeader, wsId!, { title: `Board ${ts}` })
        const boardId = getData<{ board?: { id?: string | number } }>(board.body)?.board?.id
        expect(boardId).toBeDefined()

        const l1 = await fixtures.createList(cookieHeader, wsId!, boardId!, { title: `L1 ${ts}` })
        const l2 = await fixtures.createList(cookieHeader, wsId!, boardId!, { title: `L2 ${ts}` })
        const l3 = await fixtures.createList(cookieHeader, wsId!, boardId!, { title: `L3 ${ts}` })

        expect(successStatuses()).toContain(l1.status)
        expect(successStatuses()).toContain(l2.status)
        expect(successStatuses()).toContain(l3.status)

        const l1Id = getData<{ list?: { id?: string | number } }>(l1.body)?.list?.id
        const l2Id = getData<{ list?: { id?: string | number } }>(l2.body)?.list?.id
        const l3Id = getData<{ list?: { id?: string | number } }>(l3.body)?.list?.id

        const moveRes = await fixtures.api(`/api/workspaces/${wsId}/boards/${boardId}/lists/${l3Id}`, {
            method: 'PATCH',
            headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
            body: JSON.stringify({ position: 0 }),
        })
        expect(moveRes.status).toBe(200)

        const listsRes = await fixtures.api(`/api/workspaces/${wsId}/boards/${boardId}/lists`, {
            method: 'GET',
            headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        })
        expect(listsRes.status).toBe(200)

        const payload = getData<{ lists?: Array<{ id?: string | number | bigint }> }>(listsRes.body)
        const lists = payload?.lists || []
        expect(lists.length).toBeGreaterThanOrEqual(3)

        const orderIds = lists.slice(0, 3).map((l) => (l.id?.toString ? l.id.toString() : l.id))
        expect(orderIds[0]?.toString()).toBe(l3Id?.toString())
        expect(orderIds[1]?.toString()).toBe(l1Id?.toString())
        expect(orderIds[2]?.toString()).toBe(l2Id?.toString())
    })
})
