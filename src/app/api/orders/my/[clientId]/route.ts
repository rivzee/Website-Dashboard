import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/orders/my/[clientId]
export async function GET(
    request: NextRequest,
    { params }: { params: { clientId: string } }
) {
    try {
        const orders = await prisma.order.findMany({
            where: { clientId: params.clientId },
            include: { service: true, payment: true },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
