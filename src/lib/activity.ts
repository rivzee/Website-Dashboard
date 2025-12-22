import prisma from './prisma';
import { headers } from 'next/headers';

export type ActivityType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW' | 'EXPORT' | 'INFO';
export type ActivitySeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

interface LogActivityParams {
    userId: string;
    action: string;
    type?: ActivityType;
    resource?: string;
    resourceId?: string;
    details?: any;
    severity?: ActivitySeverity;
    req?: Request; // Optional request object to extract IP/UserAgent
}

export async function logActivity({
    userId,
    action,
    type = 'INFO',
    resource = 'SYSTEM',
    resourceId,
    details,
    severity = 'INFO',
    req
}: LogActivityParams) {
    try {
        let ipAddress = 'unknown';
        let userAgent = 'unknown';

        if (req) {
            ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
            userAgent = req.headers.get('user-agent') || 'unknown';
        } else {
            // Try to get headers from next/headers if available (server components/actions)
            try {
                const headersList = headers();
                ipAddress = headersList.get('x-forwarded-for') || 'unknown';
                userAgent = headersList.get('user-agent') || 'unknown';
            } catch (e) {
                // Ignore if headers() is not available
            }
        }

        await prisma.activityLog.create({
            data: {
                userId,
                action,
                type,
                resource,
                resourceId,
                details: details ? JSON.stringify(details) : undefined,
                severity,
                ipAddress,
                userAgent
            }
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
        // Don't throw error to prevent disrupting the main flow
    }
}
