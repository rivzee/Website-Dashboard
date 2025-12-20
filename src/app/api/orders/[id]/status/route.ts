import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderCompletedEmail } from '@/lib/email';

// PUT /api/orders/[id]/status
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status } = body;

        // Get order with client info for email
        const order = await prisma.order.update({
            where: { id: params.id },
            data: { status },
            include: {
                client: { select: { email: true, fullName: true } },
                service: { select: { name: true } },
            },
        });

        // Send email notification when order is completed
        if (status === 'COMPLETED' && order.client?.email) {
            try {
                await sendOrderCompletedEmail(order.client.email, order);
            } catch (emailError) {
                console.error('⚠️ Failed to send order completed email:', emailError);
            }
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
