import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/revisions/:id - Get revision detail
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const revision = await prisma.revision.findUnique({
            where: { id: params.id },
            include: {
                order: {
                    include: {
                        service: true,
                        client: true,
                        documents: true,
                    },
                },
                requester: true,
                assignee: true,
            },
        });

        if (!revision) {
            return NextResponse.json({ error: 'Revisi tidak ditemukan' }, { status: 404 });
        }

        return NextResponse.json(revision);
    } catch (error: any) {
        console.error('Error fetching revision:', error);
        return NextResponse.json({ error: 'Gagal memuat detail revisi' }, { status: 500 });
    }
}

// PATCH /api/revisions/:id - Update revision status
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { status, assignedTo } = body;

        const updateData: any = {
            updatedAt: new Date(),
        };

        if (status) {
            updateData.status = status;
            if (status === 'COMPLETED') {
                updateData.completedAt = new Date();
            }
        }

        if (assignedTo) {
            updateData.assignedTo = assignedTo;
        }

        const revision = await prisma.revision.update({
            where: { id: params.id },
            data: updateData,
            include: {
                order: {
                    include: {
                        service: true,
                        client: true,
                    },
                },
                requester: true,
                assignee: true,
            },
        });

        // Send email notification to client when revision status changes
        if (status && revision.requester?.email) {
            try {
                const { sendRevisionStatusUpdateEmail } = await import('@/lib/email');
                await sendRevisionStatusUpdateEmail(revision.requester.email, revision);
            } catch (emailError) {
                console.error('⚠️ Failed to send revision status update email:', emailError);
            }
        }

        return NextResponse.json(revision);
    } catch (error: any) {
        console.error('Error updating revision:', error);
        return NextResponse.json({ error: 'Gagal memperbarui revisi' }, { status: 500 });
    }
}

// DELETE /api/revisions/:id - Cancel revision request (client only)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const revision = await prisma.revision.findUnique({
            where: { id: params.id },
            include: { order: true },
        });

        if (!revision) {
            return NextResponse.json({ error: 'Revisi tidak ditemukan' }, { status: 404 });
        }

        // Only allow deletion if status is PENDING
        if (revision.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Hanya revisi dengan status PENDING yang bisa dibatalkan' },
                { status: 400 }
            );
        }

        await prisma.revision.delete({
            where: { id: params.id },
        });

        // Decrement order revision count
        await prisma.order.update({
            where: { id: revision.orderId },
            data: {
                revisionCount: {
                    decrement: 1,
                },
            },
        });

        return NextResponse.json({ message: 'Revisi berhasil dibatalkan' });
    } catch (error: any) {
        console.error('Error deleting revision:', error);
        return NextResponse.json({ error: 'Gagal membatalkan revisi' }, { status: 500 });
    }
}
