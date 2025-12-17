import { prisma } from './prisma';
import bcrypt from 'bcrypt';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    email: string;
    fullName: string;
    role: string;
    token: string;
}

/**
 * Login with email and password
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthUser> {
    console.log('--- MULAI CEK LOGIN ---');
    console.log('1. Data dari Frontend:', credentials);

    // Find user
    const user = await prisma.user.findFirst({
        where: { email: credentials.email },
    });

    console.log('2. Hasil Pencarian di DB:', user);

    if (!user) {
        console.log('❌ KESIMPULAN: User tidak ditemukan di database!');
        throw new Error('Email tidak terdaftar');
    }

    if (user.password !== credentials.password) {
        console.log(
            `❌ PASSWORD SALAH! (Di DB: "${user.password}", Input: "${credentials.password}")`,
        );
        throw new Error('Password salah');
    }

    console.log('✅ LOGIN SUKSES!');
    const { password, ...result } = user;

    // Generate simple token (in production, use JWT)
    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');

    return {
        ...result,
        token,
    };
}

/**
 * Validate and create user from Google OAuth
 */
export async function validateGoogleUser(googleUser: any): Promise<AuthUser> {
    const { email, firstName, lastName } = googleUser;

    // Find user by email
    let user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        // Create new user if not exists
        const randomPassword = Math.random().toString(36).slice(-8);

        user = await prisma.user.create({
            data: {
                email,
                fullName: `${firstName} ${lastName}`,
                password: randomPassword,
                role: 'KLIEN',
            },
        });
    }

    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');

    const { password, ...result } = user;
    return {
        ...result,
        token,
    };
}
