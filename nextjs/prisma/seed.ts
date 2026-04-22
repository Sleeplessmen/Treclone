import { PrismaClient } from './generated/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        // Create users
        const alice = await prisma.user.create({
            data: {
                email: 'alice@example.com',
                passwordHash: 'hashed_password_alice',
                fullName: 'Alice Johnson',
            },
        })

        const bob = await prisma.user.create({
            data: {
                email: 'bob@example.com',
                passwordHash: 'hashed_password_bob',
                fullName: 'Bob Smith',
            },
        })

        // Create board owned by Alice
        const board = await prisma.board.create({
            data: {
                title: 'Project Management',
                description: 'Board for managing project tasks',
                ownerId: alice.id,
            },
        })

        // Create lists in the board
        const todoList = await prisma.list.create({
            data: {
                boardId: board.id,
                title: 'To Do',
                position: 0,
            },
        })

        const inProgressList = await prisma.list.create({
            data: {
                boardId: board.id,
                title: 'In Progress',
                position: 1,
            },
        })

        const doneList = await prisma.list.create({
            data: {
                boardId: board.id,
                title: 'Done',
                position: 2,
            },
        })

        // Create cards in lists
        await prisma.card.create({
            data: {
                listId: todoList.id,
                title: 'Design homepage',
                description: 'Create mockup for homepage',
                position: 0,
                createdBy: alice.id,
                assigneeUserId: bob.id,
            },
        })

        await prisma.card.create({
            data: {
                listId: inProgressList.id,
                title: 'Setup database',
                description: 'Configure PostgreSQL database',
                position: 0,
                createdBy: alice.id,
                assigneeUserId: alice.id,
            },
        })

        await prisma.card.create({
            data: {
                listId: doneList.id,
                title: 'Project kickoff',
                description: 'Initial project setup',
                position: 0,
                createdBy: alice.id,
            },
        })

        console.log('Seeding completed successfully!')
    } catch (error) {
        console.error('Error seeding database:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

main()
