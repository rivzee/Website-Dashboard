import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string; // 'payment' or 'document'

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type - expanded to include common document formats
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'application/pdf',
            // Microsoft Office
            'application/vnd.ms-excel', // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/msword', // .doc
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'application/vnd.ms-powerpoint', // .ppt
            'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
            // Archives
            'application/zip',
            'application/x-rar-compressed',
            'application/x-7z-compressed',
            // Text
            'text/plain',
            'text/csv',
        ];

        // Also check by file extension as fallback
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.xls', '.xlsx', '.doc', '.docx', '.ppt', '.pptx', '.zip', '.rar', '.7z', '.txt', '.csv'];
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: Images, PDF, Excel, Word, PowerPoint, ZIP, RAR.' },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB for documents)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 10MB.' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert to Base64 Data URI
        const base64 = buffer.toString('base64');
        const mimeType = file.type;
        const dataUri = `data:${mimeType};base64,${base64}`;

        // Return Data URI as URL
        // Note: This stores the file in the database (via the frontend). 
        // Ideally use Cloud Storage (Vercel Blob/Cloudinary) for production.
        return NextResponse.json({
            success: true,
            url: dataUri,
            filename: file.name,
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}


