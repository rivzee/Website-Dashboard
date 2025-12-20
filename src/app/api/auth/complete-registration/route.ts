import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// POST /api/auth/complete-registration - Complete registration for Google OAuth users
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, fullName, password } = body;

        // Validate required fields
        if (!email || !fullName || !password) {
            return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
        }

        // Create new user
        const user = await prisma.user.create({
            data: {
                email,
                fullName,
                password, // In production, hash this password
                role: 'KLIEN',
            },
        });

        // Send welcome email
        try {
            await sendWelcomeEmail(user.email, user.fullName);
        } catch (emailError) {
            console.error('⚠️ Failed to send welcome email, but registration succeeded:', emailError);
        }

        // Generate token
        const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            ...userWithoutPassword,
            token,
            hasPassword: true,
        }, { status: 201 });

    } catch (error: any) {
        console.error('Complete registration error:', error);
        return NextResponse.json({ error: 'Gagal membuat akun' }, { status: 500 });
    }
}
