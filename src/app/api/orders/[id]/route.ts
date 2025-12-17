import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/orders/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                client: { select: { fullName: true, email: true } },
                service: true,
                payment: true,
                documents: { include: { uploader: { select: { fullName: true } } } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
