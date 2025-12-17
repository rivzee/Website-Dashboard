import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

// GET /api/users - Get all users
// POST /api/users - Create new user (register)
export async function GET(request: NextRequest) {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fullName, email, password, phone, address, role } = body;

        // Check if email exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' },
                { status: 400 }
            );
        }

        const newUser = await prisma.user.create({
            data: { fullName, email, password, phone, address, role: role || 'KLIEN' },
        });

        // Send welcome email
        try {
            await sendWelcomeEmail(newUser.email, newUser.fullName);
        } catch (emailError) {
            console.error('⚠️ Gagal mengirim email, tapi registrasi tetap berhasil:', emailError);
        }

        return NextResponse.json(newUser);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
