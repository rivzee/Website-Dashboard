import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// GET /api/test-email - Test email sending
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get('email');

    // Check if credentials are configured
    const hasCredentials = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

    const result: any = {
        status: 'checking',
        emailUser: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.slice(0, 5)}...` : 'NOT SET',
        emailPass: process.env.EMAIL_PASS ? '***configured***' : 'NOT SET',
        hasCredentials,
    };

    if (testEmail && hasCredentials) {
        try {
            const emailResult = await sendWelcomeEmail(testEmail, 'Test User');
            result.emailSent = emailResult.success;
            result.emailError = emailResult.error || null;
        } catch (error: any) {
            result.emailSent = false;
            result.emailError = error.message;
        }
    }

    return NextResponse.json(result);
}
