import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/dashboard/sync
export async function GET() {
    try {
        const [users, services, orders, payments] = await Promise.all([
            prisma.user.findMany(),
            prisma.servicePackage.findMany({ orderBy: { createdAt: 'desc' } }),
            prisma.order.findMany({
                include: {
                    client: { select: { fullName: true, email: true } },
                    service: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.payment.findMany({
                include: {
                    order: {
                        include: {
                            client: { select: { fullName: true, email: true } },
                            service: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        return NextResponse.json({ users, services, orders, payments });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
