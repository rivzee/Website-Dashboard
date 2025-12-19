import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/auth/google - Redirect to Google OAuth
export async function GET(request: NextRequest) {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
        return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 });
    }

    // Get the base URL from the request
    const baseUrl = request.nextUrl.origin;
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    const scope = encodeURIComponent('email profile');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${scope}` +
        `&access_type=offline` +
        `&prompt=consent`;

    return NextResponse.redirect(authUrl);
}
