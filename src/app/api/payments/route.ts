import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET / POST /api/payments
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const whereClause: any = {};
        if (status) {
            whereClause.status = status;
        }

        const payments = await prisma.payment.findMany({
            where: whereClause,
            include: {
                order: {
                    include: {
                        client: { select: { fullName: true, email: true } },
                        service: { select: { name: true, price: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(payments);
    } catch (error: any) {
        console.error('Error fetching payments:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, paymentMethod, proofUrl, orderId } = body;

        // If proofUrl is provided, set status to PENDING_APPROVAL for admin review
        const status = proofUrl ? 'PENDING_APPROVAL' : 'UNPAID';

        const payment = await prisma.payment.create({
            data: { amount, status, paymentMethod, proofUrl, orderId },
        });

        console.log('Payment created:', payment);
        return NextResponse.json(payment);
    } catch (error: any) {
        console.error('Error creating payment:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
