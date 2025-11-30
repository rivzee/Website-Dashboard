import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Pastikan path import benar
import { EmailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) { }

  // Fungsi Register (Create User)
  async create(data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    role?: 'KLIEN' | 'ADMIN' | 'AKUNTAN'
  }) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error('Email sudah terdaftar. Silakan gunakan email lain atau login.');
    }

    const newUser = await this.prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        password: data.password, // Kita pakai password polos dulu biar gampang
        phone: data.phone, // Tambahkan phone
        address: data.address, // Tambahkan address
        role: (data.role || 'KLIEN') as any,
      },
    });

    // Kirim email selamat datang
    try {
      await this.emailService.sendWelcomeEmail(newUser.email, newUser.fullName);
      console.log(`✅ Email selamat datang terkirim ke ${newUser.email}`);
    } catch (emailError) {
      console.error('⚠️ Gagal mengirim email, tapi registrasi tetap berhasil:', emailError);
      // Tidak throw error, biar registrasi tetap sukses meski email gagal
    }

    return newUser;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: string, data: { fullName?: string; email?: string; role?: string; phone?: string; password?: string }) {
    return this.prisma.user.update({
      where: { id },
      data: data as any,
    });
  }

  async remove(id: string) {
    // 1. Hapus Activity Log user ini
    await this.prisma.activityLog.deleteMany({ where: { userId: id } });

    // 2. Hapus Dokumen yang diupload user ini (yang tidak terikat order, atau biarkan cascade order menangani)
    // Kita hapus yang uploaderId-nya user ini
    await this.prisma.document.deleteMany({ where: { uploaderId: id } });

    // 3. Hapus Order di mana user ini adalah Client
    // Kita harus cari ordernya dulu untuk hapus payment & documents terkait order
    const clientOrders = await this.prisma.order.findMany({ where: { clientId: id } });

    for (const order of clientOrders) {
      // Hapus Payment terkait order
      await this.prisma.payment.deleteMany({ where: { orderId: order.id } });
      // Hapus Document terkait order
      await this.prisma.document.deleteMany({ where: { orderId: order.id } });
      // Hapus Order
      await this.prisma.order.delete({ where: { id: order.id } });
    }

    // 4. Jika user adalah Akuntan, set accountantId di order jadi null (jangan hapus ordernya)
    await this.prisma.order.updateMany({
      where: { accountantId: id },
      data: { accountantId: null }
    });

    // 5. Akhirnya hapus User
    return this.prisma.user.delete({ where: { id } });
  }
}
