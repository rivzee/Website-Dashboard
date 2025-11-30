import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        amount: number;
        paymentMethod: string;
        proofUrl?: string;
        orderId: string;
    }) {
        return this.prisma.payment.create({
            data: {
                amount: data.amount,
                status: 'UNPAID',
                paymentMethod: data.paymentMethod,
                proofUrl: data.proofUrl,
                orderId: data.orderId,
            },
        });
    }

    async update(id: string, data: { status?: string; paidAt?: Date }) {
        const payment = await this.prisma.payment.update({
            where: { id },
            data: data as any,
        });

        if (data.status === 'PAID') {
            await this.prisma.order.update({
                where: { id: payment.orderId },
                data: { status: 'PAID' },
            });
        }

        return payment;
    }

    async findByOrder(orderId: string) {
        return this.prisma.payment.findUnique({
            where: { orderId },
        });
    }

    async findAll() {
        return this.prisma.payment.findMany({
            include: {
                order: {
                    include: {
                        client: { select: { fullName: true, email: true } },
                        service: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
