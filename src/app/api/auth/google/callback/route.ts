import { NextRequest, NextResponse } from 'next/server';
import { validateGoogleUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET /api/auth/google/callback - Handle Google OAuth callback
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    const baseUrl = request.nextUrl.origin;

    if (error) {
        return NextResponse.redirect(`${baseUrl}/login?error=google_denied`);
    }

    if (!code) {
        return NextResponse.redirect(`${baseUrl}/login?error=no_code`);
    }

    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return NextResponse.redirect(`${baseUrl}/login?error=oauth_not_configured`);
        }

        const redirectUri = `${baseUrl}/api/auth/google/callback`;

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        });

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            console.error('Token error:', tokenData);
            return NextResponse.redirect(`${baseUrl}/login?error=token_error`);
        }

        // Get user info from Google
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const googleUser = await userResponse.json();

        if (!googleUser.email) {
            return NextResponse.redirect(`${baseUrl}/login?error=no_email`);
        }

        // Validate/create user in our system
        const user = await validateGoogleUser({
            email: googleUser.email,
            firstName: googleUser.given_name || googleUser.name?.split(' ')[0] || 'User',
            lastName: googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '',
        });

        // Encode user data to pass to frontend
        const userData = encodeURIComponent(JSON.stringify(user));

        // Redirect to callback page with user data
        return NextResponse.redirect(`${baseUrl}/auth/callback?user=${userData}`);

    } catch (error: any) {
        console.error('Google OAuth error:', error);
        return NextResponse.redirect(`${baseUrl}/login?error=oauth_failed`);
    }
}
