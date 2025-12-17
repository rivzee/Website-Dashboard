import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOrderNotification } from '@/lib/email';

// GET /api/orders - Get all orders
// POST /api/orders - Create new order
export async function GET(request: NextRequest) {
    try {
        const orders = await prisma.order.findMany({
            include: {
                client: { select: { fullName: true, email: true } },
                service: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { clientId, serviceId, notes } = body;

        // Get service price
        const service = await prisma.servicePackage.findUnique({
            where: { id: serviceId },
        });

        if (!service) {
            return NextResponse.json({ error: 'Layanan tidak ditemukan' }, { status: 404 });
        }

        const order = await prisma.order.create({
            data: {
                clientId,
                serviceId,
                totalAmount: service.price,
                status: 'PENDING_PAYMENT',
                notes,
            },
            include: { client: true },
        });

        // Send email notification
        try {
            if (order.client?.email) {
                await sendOrderNotification(order.client.email, order);
            }
        } catch (error) {
            console.error('Gagal mengirim email notifikasi order:', error);
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
