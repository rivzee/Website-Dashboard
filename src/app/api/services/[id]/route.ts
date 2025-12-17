import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/services/[id] - Update service
// DELETE /api/services/[id] - Delete service
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const service = await prisma.servicePackage.update({
            where: { id: params.id },
            data: body,
        });

        return NextResponse.json(service);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Find related orders
        const orders = await prisma.order.findMany({ where: { serviceId: params.id } });

        // Delete all related orders with their payments & documents
        for (const order of orders) {
            await prisma.payment.deleteMany({ where: { orderId: order.id } });
            await prisma.document.deleteMany({ where: { orderId: order.id } });
            await prisma.order.delete({ where: { id: order.id } });
        }

        // Finally delete the service
        const service = await prisma.servicePackage.delete({
            where: { id: params.id },
        });

        return NextResponse.json(service);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
