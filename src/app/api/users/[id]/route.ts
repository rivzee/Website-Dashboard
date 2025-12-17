import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET, PUT, DELETE /api/users/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await prisma.user.findUnique({ where: { id: params.id } });
        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const user = await prisma.user.update({ where: { id: params.id }, data: body });
        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.activityLog.deleteMany({ where: { userId: params.id } });
        await prisma.document.deleteMany({ where: { uploaderId: params.id } });

        const clientOrders = await prisma.order.findMany({ where: { clientId: params.id } });
        for (const order of clientOrders) {
            await prisma.payment.deleteMany({ where: { orderId: order.id } });
            await prisma.document.deleteMany({ where: { orderId: order.id } });
            await prisma.order.delete({ where: { id: order.id } });
        }

        await prisma.order.updateMany({ where: { accountantId: params.id }, data: { accountantId: null } });
        const user = await prisma.user.delete({ where: { id: params.id } });

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
