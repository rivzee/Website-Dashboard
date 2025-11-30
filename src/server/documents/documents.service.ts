import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        fileName: string;
        fileUrl: string;
        fileType: string;
        isResult: boolean;
        orderId: string;
        uploaderId: string;
    }) {
        return this.prisma.document.create({
            data: {
                fileName: data.fileName,
                fileUrl: data.fileUrl,
                fileType: data.fileType,
                isResult: data.isResult,
                orderId: data.orderId,
                uploaderId: data.uploaderId,
            },
        });
    }

    async findByOrder(orderId: string) {
        return this.prisma.document.findMany({
            where: { orderId },
            include: { uploader: { select: { fullName: true, email: true } } },
            orderBy: { uploadedAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.document.findUnique({
            where: { id },
            include: { order: true, uploader: true },
        });
    }
}
