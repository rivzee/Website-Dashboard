import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) { }

  // Tambah Layanan Baru
  async create(createServiceDto: {
    name: string;
    description: string;
    price: number;
    duration?: string;
    category?: string;
    isActive?: boolean;
  }) {
    return this.prisma.servicePackage.create({
      data: {
        name: createServiceDto.name,
        description: createServiceDto.description,
        price: createServiceDto.price,
        duration: createServiceDto.duration || '',
        category: createServiceDto.category || 'Lainnya',
        isActive: createServiceDto.isActive !== undefined ? createServiceDto.isActive : true,
      },
    });
  }

  // Lihat Semua Layanan
  async findAll() {
    return this.prisma.servicePackage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Update Layanan
  async update(id: string, updateServiceDto: {
    name?: string;
    description?: string;
    price?: number;
    duration?: string;
    category?: string;
    isActive?: boolean;
  }) {
    return this.prisma.servicePackage.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  // Hapus Layanan
  async remove(id: string) {
    // Cari order yang menggunakan layanan ini
    const orders = await this.prisma.order.findMany({ where: { serviceId: id } });

    // Hapus semua order terkait beserta payment & document-nya
    for (const order of orders) {
      await this.prisma.payment.deleteMany({ where: { orderId: order.id } });
      await this.prisma.document.deleteMany({ where: { orderId: order.id } });
      await this.prisma.order.delete({ where: { id: order.id } });
    }

    // Akhirnya hapus Service
    return this.prisma.servicePackage.delete({
      where: { id },
    });
  }
}
