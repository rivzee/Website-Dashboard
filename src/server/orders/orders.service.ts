import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService
  ) { }

  // Klien Membuat Order
  async create(createOrderDto: { clientId: string; serviceId: string; notes?: string }) {
    // Ambil harga layanan dulu
    const service = await this.prisma.servicePackage.findUnique({
      where: { id: createOrderDto.serviceId },
    });

    if (!service) throw new NotFoundException('Layanan tidak ditemukan');

    const order = await this.prisma.order.create({
      data: {
        clientId: createOrderDto.clientId,
        serviceId: createOrderDto.serviceId,
        totalAmount: service.price,
        status: 'PENDING_PAYMENT',
        notes: createOrderDto.notes,
      },
      include: { client: true } // Include client to get email
    });

    // Kirim notifikasi email ke klien
    try {
      if (order.client?.email) {
        await this.emailService.sendOrderNotification(order.client.email, order);
      }
    } catch (error) {
      console.error('Gagal mengirim email notifikasi order:', error);
    }

    return order;
  }

  // Admin/Akuntan Melihat Semua Order
  async findAll() {
    return this.prisma.order.findMany({
      include: {
        client: { select: { fullName: true, email: true } },
        service: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Klien Melihat Order Sendiri
  async findMyOrders(clientId: string) {
    return this.prisma.order.findMany({
      where: { clientId: clientId },
      include: { service: true, payment: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }

  // Find One Order
  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        client: { select: { fullName: true, email: true } },
        service: true,
        payment: true,
        documents: { include: { uploader: { select: { fullName: true } } } },
      },
    });
  }
}
