import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/payments/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const { status, paidAt } = body;

        const payment = await prisma.payment.update({
            where: { id: params.id },
            data: { status, paidAt },
        });

        // If payment is marked as PAID, update order status
        if (status === 'PAID') {
            await prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'PAID' },
            });
        }

        return NextResponse.json(payment);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
