import { describe, test, expect } from 'vitest'
import fixtures from '../fixtures'
import { authAs, getData, successStatuses, DEFAULT_TEST_PASSWORD } from '../test-utils'

const ts = Date.now()
const TEST_PASSWORD = DEFAULT_TEST_PASSWORD

describe('E2E Card Tests', () => {
    test('TC15 - create card in list', async () => {
        const cookieHeader = await authAs(`qa+card1.${ts}@example.com`, TEST_PASSWORD)

        const ws = await fixtures.createWorkspace(cookieHeader, { name: `ws-card-${ts}` })
        const wsId = getData<{ workspace?: { id?: string | number } }>(ws.body)?.workspace?.id
        expect(wsId).toBeDefined()

        const board = await fixtures.createBoard(cookieHeader, wsId!, { title: `Board Card ${ts}` })
        const boardId = getData<{ board?: { id?: string | number } }>(board.body)?.board?.id
        expect(boardId).toBeDefined()

        const list = await fixtures.createList(cookieHeader, wsId!, boardId!, { title: 'To Do' })
        const listId = getData<{ list?: { id?: string | number } }>(list.body)?.list?.id
        expect(listId).toBeDefined()

        const res = await fixtures.createCard(cookieHeader, wsId!, boardId!, listId!, { title: 'E2E Card 1' })
        expect(successStatuses()).toContain(res.status)
    })

    test('TC16 - move card between lists', async () => {
        const cookieHeader = await authAs(`qa+card2.${ts}@example.com`, TEST_PASSWORD)

        const ws = await fixtures.createWorkspace(cookieHeader, { name: `ws-card-move-${ts}` })
        const wsId = getData<{ workspace?: { id?: string | number } }>(ws.body)?.workspace?.id
        expect(wsId).toBeDefined()

        const board = await fixtures.createBoard(cookieHeader, wsId!, { title: `Board Move ${ts}` })
        const boardId = getData<{ board?: { id?: string | number } }>(board.body)?.board?.id
        expect(boardId).toBeDefined()

        const listA = await fixtures.createList(cookieHeader, wsId!, boardId!, { title: `List A ${ts}` })
        const listAId = getData<{ list?: { id?: string | number } }>(listA.body)?.list?.id
        const listB = await fixtures.createList(cookieHeader, wsId!, boardId!, { title: `List B ${ts}` })
        const listBId = getData<{ list?: { id?: string | number } }>(listB.body)?.list?.id
        expect(listAId).toBeDefined()
        expect(listBId).toBeDefined()

        const c1 = await fixtures.createCard(cookieHeader, wsId!, boardId!, listAId!, { title: `Card A1 ${ts}` })
        const c2 = await fixtures.createCard(cookieHeader, wsId!, boardId!, listAId!, { title: `Card A2 ${ts}` })
        const c3 = await fixtures.createCard(cookieHeader, wsId!, boardId!, listAId!, { title: `Card A3 ${ts}` })
        expect(successStatuses()).toContain(c1.status)
        expect(successStatuses()).toContain(c2.status)
        expect(successStatuses()).toContain(c3.status)

        const c3Id = getData<{ card?: { id?: string | number } }>(c3.body)?.card?.id
        expect(c3Id).toBeDefined()

        const moveRes = await fixtures.api(`/api/workspaces/${wsId}/boards/${boardId}/lists/${listAId}/cards/${c3Id}/move`, {
            method: 'PATCH',
            headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
            body: JSON.stringify({ listId: listBId, position: 0 }),
        })
        expect(moveRes.status).toBe(200)

        const listBCards = await fixtures.api(`/api/workspaces/${wsId}/boards/${boardId}/lists/${listBId}/cards`, {
            method: 'GET',
            headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
        })
        expect(listBCards.status).toBe(200)

        const payload = getData<{ cards?: Array<{ id?: string | number }> }>(listBCards.body)
        const cards = payload?.cards || []
        expect(Array.isArray(cards)).toBeTruthy()
        expect(cards.length).toBeGreaterThan(0)
        const firstCardId = cards[0]?.id
        expect(firstCardId?.toString()).toBe(c3Id?.toString())
    })

    test('TC19 - assign member to card', async () => {
        const ownerEmail = `qa+card.owner.${ts}@example.com`
        const assigneeEmail = `qa+card.assignee.${ts}@example.com`

        await fixtures.createUser(assigneeEmail, TEST_PASSWORD, 'Assignee')
        const cookieHeader = await authAs(ownerEmail, TEST_PASSWORD)

        const ws = await fixtures.createWorkspace(cookieHeader, { name: `ws-card-assign-${ts}` })
        const wsId = getData<{ workspace?: { id?: string | number } }>(ws.body)?.workspace?.id
        expect(wsId).toBeDefined()

        const board = await fixtures.createBoard(cookieHeader, wsId!, { title: `Board Assign ${ts}` })
        const boardId = getData<{ board?: { id?: string | number } }>(board.body)?.board?.id
        expect(boardId).toBeDefined()

        const list = await fixtures.createList(cookieHeader, wsId!, boardId!, { title: `List Assign ${ts}` })
        const listId = getData<{ list?: { id?: string | number } }>(list.body)?.list?.id
        expect(listId).toBeDefined()

        const cardRes = await fixtures.createCard(cookieHeader, wsId!, boardId!, listId!, { title: `Card Assign ${ts}` })
        expect(successStatuses()).toContain(cardRes.status)
        const cardId = getData<{ card?: { id?: string | number } }>(cardRes.body)?.card?.id
        expect(cardId).toBeDefined()

        const inviteRes = await fixtures.inviteWorkspaceMember(cookieHeader, wsId!, {
            email: assigneeEmail,
            role: 'member',
        })
        expect(successStatuses()).toContain(inviteRes.status)

        const membersRes = await fixtures.listWorkspaceMembers(cookieHeader, wsId!)
        expect(membersRes.status).toBe(200)
        const membersData = getData<{ members?: Array<{ user?: { id?: string | number; email?: string } }> }>(membersRes.body)
        const assignee = (membersData?.members || []).find((m) => m.user?.email === assigneeEmail)
        const assigneeId = assignee?.user?.id
        expect(assigneeId).toBeDefined()

        const patchRes = await fixtures.api(`/api/workspaces/${wsId}/boards/${boardId}/lists/${listId}/cards/${cardId}`, {
            method: 'PATCH',
            headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
            body: JSON.stringify({ assigneeUserId: assigneeId?.toString() }),
        })
        expect(patchRes.status).toBe(200)

        const updatedCard = getData<{ card?: { assigneeUserId?: string | number } }>(patchRes.body)?.card
        expect(updatedCard).toBeDefined()
        expect(updatedCard?.assigneeUserId?.toString()).toBe(assigneeId?.toString())
    })
})
