import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/revisions - Get all revisions (filtered by user role)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const role = searchParams.get('role');
        const orderId = searchParams.get('orderId');

        let query: any = {
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
            orderBy: {
                createdAt: 'desc',
            },
        };

        // Filter based on role
        if (role === 'KLIEN' && userId) {
            // Klien only sees their own revision requests
            query.where = { requestedBy: userId };
        } else if (role === 'AKUNTAN') {
            // Akuntan sees ALL revisions (so they can pick up and handle them)
            // This ensures client revision requests are visible to accountants
            query.where = {}; // No filter - show all revisions
        } else if (role === 'ADMIN') {
            // Admin sees all revisions
            query.where = {};
        }

        // Filter by order if provided
        if (orderId) {
            query.where = { ...query.where, orderId };
        }

        const revisions = await prisma.revision.findMany(query);

        return NextResponse.json(revisions);
    } catch (error: any) {
        console.error('Error fetching revisions:', error);
        return NextResponse.json({ error: 'Gagal memuat revisi' }, { status: 500 });
    }
}

// POST /api/revisions - Create new revision request
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, requestedBy, title, description } = body;

        // Validate required fields
        if (!orderId || !requestedBy || !title || !description) {
            return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
        }

        // Check order revision count
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                revisions: true,
                service: true,
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
        }

        // Check if max revisions reached (2)
        if (order.revisionCount >= 2) {
            return NextResponse.json(
                { error: 'Batas maksimal revisi (2x) sudah tercapai' },
                { status: 400 }
            );
        }

        // Create revision
        const revision = await prisma.revision.create({
            data: {
                orderId,
                requestedBy,
                title,
                description,
                status: 'PENDING',
            },
            include: {
                order: {
                    include: {
                        service: true,
                    }
                },
                requester: true,
            },
        });

        // Update order revision count
        await prisma.order.update({
            where: { id: orderId },
            data: {
                revisionCount: {
                    increment: 1,
                },
            },
        });

        // Send email notification to all accountants
        try {
            const { sendRevisionNotificationEmail } = await import('@/lib/email');
            const accountants = await prisma.user.findMany({
                where: { role: 'AKUNTAN' },
                select: { email: true },
            });

            for (const accountant of accountants) {
                if (accountant.email) {
                    await sendRevisionNotificationEmail(accountant.email, revision);
                }
            }
        } catch (emailError) {
            console.error('⚠️ Failed to send revision notification emails:', emailError);
        }

        return NextResponse.json(revision, { status: 201 });
    } catch (error: any) {
        console.error('Error creating revision:', error);
        return NextResponse.json({ error: 'Gagal membuat permintaan revisi' }, { status: 500 });
    }
}
