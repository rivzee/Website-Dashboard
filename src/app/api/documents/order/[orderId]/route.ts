import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/documents/order/[orderId]
export async function GET(request: NextRequest, { params }: { params: { orderId: string } }) {
    try {
        const documents = await prisma.document.findMany({
            where: { orderId: params.orderId },
            include: { uploader: { select: { fullName: true, email: true } } },
            orderBy: { uploadedAt: 'desc' },
        });

        return NextResponse.json(documents);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
