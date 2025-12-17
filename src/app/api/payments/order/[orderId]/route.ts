import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/payments/order/[orderId]
export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
    try {
        const payment = await prisma.payment.findUnique({ where: { orderId: params.orderId } });
        return NextResponse.json(payment);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
