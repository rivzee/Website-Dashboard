import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/activity';

// POST /api/documents
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fileName, fileUrl, fileType, isResult, orderId, uploaderId } = body;

        const document = await prisma.document.create({
            data: { fileName, fileUrl, fileType, isResult, orderId, uploaderId },
        });

        // Log activity
        await logActivity({
            userId: uploaderId,
            action: isResult ? 'Mengunggah hasil pekerjaan' : 'Mengunggah dokumen pendukung',
            type: 'CREATE',
            resource: 'Dokumen',
            resourceId: document.id,
            details: { fileName, orderId, isResult },
            req: request
        });

        return NextResponse.json(document);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
