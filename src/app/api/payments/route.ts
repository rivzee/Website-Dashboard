import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET / POST /api/payments
export async function GET() {
    try {
        const payments = await prisma.payment.findMany({
            include: {
                order: {
                    include: {
                        client: { select: { fullName: true, email: true } },
                        service: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(payments);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, paymentMethod, proofUrl, orderId } = body;

        const payment = await prisma.payment.create({
            data: { amount, status: 'UNPAID', paymentMethod, proofUrl, orderId },
        });

        return NextResponse.json(payment);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
