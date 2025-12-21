import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/settings - Get all settings or specific setting by key
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (key) {
            const setting = await prisma.settings.findUnique({
                where: { key }
            });

            if (!setting) {
                return NextResponse.json({ key, value: null });
            }

            return NextResponse.json({
                key: setting.key,
                value: JSON.parse(setting.value)
            });
        }

        // Get all settings
        const settings = await prisma.settings.findMany();

        const settingsObject: Record<string, any> = {};
        for (const setting of settings) {
            try {
                settingsObject[setting.key] = JSON.parse(setting.value);
            } catch {
                settingsObject[setting.key] = setting.value;
            }
        }

        return NextResponse.json(settingsObject);
    } catch (error: any) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/settings - Create or update setting
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { key, value } = body;

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

        const setting = await prisma.settings.upsert({
            where: { key },
            update: { value: stringValue },
            create: { key, value: stringValue }
        });

        return NextResponse.json({
            key: setting.key,
            value: JSON.parse(setting.value)
        });
    } catch (error: any) {
        console.error('Error saving settings:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT /api/settings - Bulk update settings
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const updates = [];

        for (const [key, value] of Object.entries(body)) {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

            updates.push(
                prisma.settings.upsert({
                    where: { key },
                    update: { value: stringValue },
                    create: { key, value: stringValue }
                })
            );
        }

        await Promise.all(updates);

        return NextResponse.json({ success: true, message: 'Settings saved successfully' });
    } catch (error: any) {
        console.error('Error saving settings:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
