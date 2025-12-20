import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPaymentVerifiedEmail } from '@/lib/email';

// PATCH /api/payments/:id/approve - Admin approve payment
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { adminId, action } = body; // action: 'approve' or 'reject'

        if (!adminId || !action) {
            return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
        }

        const payment = await prisma.payment.findUnique({
            where: { id: params.id },
            include: {
                order: {
                    include: {
                        client: { select: { email: true, fullName: true } }
                    }
                }
            },
        });

        if (!payment) {
            return NextResponse.json({ error: 'Pembayaran tidak ditemukan' }, { status: 404 });
        }

        if (payment.status !== 'PENDING_APPROVAL') {
            return NextResponse.json(
                { error: 'Hanya pembayaran dengan status PENDING_APPROVAL yang bisa disetujui' },
                { status: 400 }
            );
        }

        const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
        const orderStatus = action === 'approve' ? 'IN_PROGRESS' : 'PENDING_PAYMENT';

        // Update payment
        const updatedPayment = await prisma.payment.update({
            where: { id: params.id },
            data: {
                status: newStatus,
                approvedBy: adminId,
                approvedAt: new Date(),
                paidAt: action === 'approve' ? new Date() : payment.paidAt,
            },
        });

        // Update order status
        await prisma.order.update({
            where: { id: payment.orderId },
            data: {
                status: orderStatus,
            },
        });

        // Send email notification to client when payment is approved
        if (action === 'approve' && payment.order?.client?.email) {
            try {
                await sendPaymentVerifiedEmail(payment.order.client.email, payment.order);
            } catch (emailError) {
                console.error('⚠️ Failed to send payment verified email:', emailError);
            }
        }

        return NextResponse.json({
            message: action === 'approve' ? 'Pembayaran berhasil disetujui' : 'Pembayaran ditolak',
            payment: updatedPayment,
        });
    } catch (error: any) {
        console.error('Error approving payment:', error);
        return NextResponse.json(
            { error: 'Gagal memproses persetujuan pembayaran' },
            { status: 500 }
        );
    }
}
