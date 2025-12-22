import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderCompletedEmail } from '@/lib/email';
import { logActivity } from '@/lib/activity';

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

        // Log activity
        // Note: In a real app, we would get the current user ID from the session/token
        // For now, we'll assume it's an accountant or admin performing this action
        // We can try to infer from the context or pass userId in the body if needed
        // For this implementation, we'll log it as a system/accountant action

        await logActivity({
            userId: 'system', // Or extract from auth token if available in request
            action: `Mengubah status pesanan menjadi ${status}`,
            type: 'UPDATE',
            resource: 'Pesanan',
            resourceId: order.id,
            details: {
                previousStatus: 'UNKNOWN', // We could fetch this first if needed
                newStatus: status,
                serviceName: order.service.name
            },
            req: request
        });

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
