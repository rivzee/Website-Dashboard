import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/documents
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fileName, fileUrl, fileType, isResult, orderId, uploaderId } = body;

        const document = await prisma.document.create({
            data: { fileName, fileUrl, fileType, isResult, orderId, uploaderId },
        });

        return NextResponse.json(document);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
