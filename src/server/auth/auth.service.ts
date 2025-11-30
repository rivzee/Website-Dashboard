import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

  async login(body: { email: string; password: string }) {
    console.log('--- MULAI CEK LOGIN ---');
    console.log('1. Data dari Frontend:', body);

    // Cari user
    const user = await this.prisma.user.findFirst({
      where: { email: body.email },
    });

    console.log('2. Hasil Pencarian di DB:', user);

    if (!user) {
      console.log('❌ KESIMPULAN: User tidak ditemukan di database!');
      throw new UnauthorizedException('Email tidak terdaftar');
    }

    if (user.password !== body.password) {
      console.log(
        `❌ PASSWORD SALAH! (Di DB: "${user.password}", Input: "${body.password}")`,
      );
      throw new UnauthorizedException('Password salah');
    }

    console.log('✅ LOGIN SUKSES!');
    const { password, ...result } = user;

    // Generate Token
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });

    return {
      ...result,
      token,
    };
  }

  async validateGoogleUser(googleUser: any) {
    const { email, firstName, lastName, picture } = googleUser;

    // Cari user berdasarkan email
    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Jika tidak ada, buat user baru
      // Password random karena login via Google
      const randomPassword = Math.random().toString(36).slice(-8);

      user = await this.prisma.user.create({
        data: {
          email,
          fullName: `${firstName} ${lastName}`,
          password: randomPassword,
          role: 'KLIEN', // Default role
          // picture: picture // Jika ada field picture di DB
        },
      });
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });

    const { password, ...result } = user;
    return {
      ...result,
      token,
    };
  }
}
