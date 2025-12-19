import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const user = await loginUser(body);

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Login failed' },
            { status: 401 }
        );
    }
}
