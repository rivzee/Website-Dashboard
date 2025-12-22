import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';
import { logActivity } from '@/lib/activity';

export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const user = await loginUser(body);

        // Log successful login
        await logActivity({
            userId: user.id,
            action: 'Masuk ke sistem',
            type: 'LOGIN',
            resource: 'Auth',
            severity: 'INFO',
            req: request
        });

        return NextResponse.json(user);
    } catch (error: any) {
        // Log failed login attempt
        // Note: We might not have userId if email is invalid, but we can log the attempt
        // For now, we only log if we can identify the user or just log as system event
        // Ideally we'd look up the user by email to log the failed attempt against them

        return NextResponse.json(
            { error: error.message || 'Login failed' },
            { status: 401 }
        );
    }
}
