import { NextRequest, NextResponse } from 'next/server';
import { verifyTokenFromCookie } from '@/lib/utils/auth';
import { successResponse, unauthorized } from '@/lib/utils/api-utils';
import prisma from '@/lib/db/prisma';
import { format } from 'date-fns';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ workspaceId: string }> }
) {
    const { workspaceId } = await params;
    const { valid, userId } = verifyTokenFromCookie(request);

    if (!valid || !userId) {
        return unauthorized();
    }

    const auditLogs = await prisma.auditLog.findMany({
        where: { workspaceId: BigInt(workspaceId) },
        include: {
            user: {
                select: {
                    fullName: true,
                    email: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
    });

    const activities = auditLogs.map((log) => {
        const occurredAt = log.createdAt.toISOString();
        const absoluteTime = format(log.createdAt, 'PPpp');

        let summary = '';
        let target = '';

        const metadata = typeof log.metadata === 'string' ? JSON.parse(log.metadata || '{}') : {};

        switch (log.entity) {
            case 'BOARD':
                summary = `${log.action.toLowerCase()} board`;
                target = metadata.title || 'Unknown board';
                break;
            case 'CARD':
                summary = `${log.action.toLowerCase()} card`;
                target = metadata.title || 'Unknown card';
                break;
            case 'LIST':
                summary = `${log.action.toLowerCase()} list`;
                target = metadata.title || 'Unknown list';
                break;
            case 'MEMBER':
                summary = `${log.action.toLowerCase()} member`;
                target = metadata.email || 'Unknown member';
                break;
            default:
                summary = log.action.toLowerCase();
                target = 'Resource';
        }

        return {
            id: String(log.id),
            user: log.user.fullName || log.user.email,
            action: log.action,
            target,
            summary,
            occurredAt,
            absoluteTime,
        };
    });

    return NextResponse.json(
        successResponse({
            message: 'Activities fetched successfully',
            activities,
        }),
        { status: 200 }
    );
}