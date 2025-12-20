import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

        // Check if user already exists in database
        const existingUser = await prisma.user.findUnique({
            where: { email: googleUser.email }
        });

        if (existingUser) {
            // User exists - log them in directly
            const token = Buffer.from(`${existingUser.id}:${existingUser.email}:${Date.now()}`).toString('base64');

            const { password: _, ...userWithoutPassword } = existingUser;
            const userData = encodeURIComponent(JSON.stringify({
                ...userWithoutPassword,
                token,
                hasPassword: true,
            }));

            return NextResponse.redirect(`${baseUrl}/auth/callback?user=${userData}`);
        } else {
            // New user - redirect to complete registration page
            const fullName = googleUser.given_name
                ? `${googleUser.given_name} ${googleUser.family_name || ''}`.trim()
                : googleUser.name || 'User';

            const email = encodeURIComponent(googleUser.email);
            const name = encodeURIComponent(fullName);

            return NextResponse.redirect(`${baseUrl}/auth/complete-registration?email=${email}&name=${name}`);
        }

    } catch (error: any) {
        console.error('Google OAuth error:', error);
        return NextResponse.redirect(`${baseUrl}/login?error=oauth_failed`);
    }
}
