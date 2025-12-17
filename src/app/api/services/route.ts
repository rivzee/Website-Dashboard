import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/services - Get all services
// POST /api/services - Create new service
export async function GET(request: NextRequest) {
    try {
        const services = await prisma.servicePackage.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(services);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, price, duration, category, isActive } = body;

        const service = await prisma.servicePackage.create({
            data: {
                name,
                description,
                price,
                duration: duration || '',
                category: category || 'Lainnya',
                isActive: isActive !== undefined ? isActive : true,
            },
        });

        return NextResponse.json(service);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
