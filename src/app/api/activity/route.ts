import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const type = searchParams.get('type');
        const severity = searchParams.get('severity');

        const where: any = {};

        if (type && type !== 'all') {
            // Map frontend filter keys to database values if needed
            if (type === 'security') {
                where.type = { in: ['LOGIN', 'LOGOUT'] };
            } else if (type === 'data') {
                where.type = { in: ['CREATE', 'UPDATE', 'DELETE'] };
            } else if (type === 'user') {
                where.type = { notIn: ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE'] };
            } else {
                where.type = type;
            }
        }

        if (severity) {
            where.severity = severity;
        }

        const logs = await prisma.activityLog.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: {
                timestamp: 'desc'
            },
            include: {
                user: {
                    select: {
                        fullName: true,
                        role: true,
                        email: true
                    }
                }
            }
        });

        // Transform data for frontend
        const formattedLogs = logs.map(log => ({
            id: log.id,
            userId: log.userId,
            userName: log.user.fullName,
            userRole: log.user.role,
            action: log.action,
            type: log.type,
            resource: log.resource,
            resourceId: log.resourceId,
            ipAddress: log.ipAddress || '-',
            userAgent: log.userAgent || '-',
            timestamp: log.timestamp,
            details: log.details,
            severity: log.severity
        }));

        return NextResponse.json(formattedLogs);
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch activity logs' },
            { status: 500 }
        );
    }
}
