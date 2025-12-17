import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    return NextResponse.json({
        message: 'Environment Variable Check',
        googleClientId: clientId ? clientId.substring(0, 10) + '...' : 'MISSING',
    });
}
