import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding (PLAIN TEXT PASSWORD)...');

  // 1. Clean Database
  try {
    await prisma.activityLog.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.document.deleteMany();
    await prisma.order.deleteMany();
    await prisma.servicePackage.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Database cleaned');
  } catch (error) {
    console.log('⚠️ Warning cleaning db:', error);
  }

  // 2. Create Users (PASSWORD PLAIN TEXT "123456")
  const password = '123456';

  // Admin
  const admin = await prisma.user.create({
    data: {
      fullName: 'Admin Utama',
      email: 'admin@akuntan.com',
      password: password, // Plain text
      role: 'ADMIN',
      phone: '081234567890',
      address: 'Kantor Pusat Jakarta',
    },
  });

  // Akuntan
  const accountant = await prisma.user.create({
    data: {
      fullName: 'Budi Akuntan',
      email: 'akuntan@akuntan.com',
      password: password, // Plain text
      role: 'AKUNTAN',
      phone: '081234567891',
      address: 'Cabang Bandung',
    },
  });

  // Klien
  const client = await prisma.user.create({
    data: {
      fullName: 'PT Maju Jaya',
      email: 'klien@akuntan.com',
      password: password, // Plain text
      role: 'KLIEN',
      phone: '081234567892',
      address: 'Kawasan Industri Cikarang',
    },
  });

  console.log('� Users created with password "123456"');

  // 3. Create Services
  const services = [
    {
      name: 'Jasa Penyusunan Laporan Keuangan',
      description: 'Penyusunan laporan keuangan komprehensif (Neraca, Laba Rugi, Arus Kas) sesuai standar akuntansi yang berlaku.',
      price: 2500000,
      duration: '1 Bulan',
      category: 'Laporan Keuangan',
      isActive: true,
    },
    {
      name: 'Jasa Pembukuan',
      description: 'Layanan pencatatan transaksi keuangan harian dan bulanan yang rapi, terstruktur, dan akurat.',
      price: 1000000,
      duration: '1 Bulan',
      category: 'Pembukuan',
      isActive: true,
    },
    {
      name: 'Jasa Pendampingan Penyusunan Laporan Keuangan',
      description: 'Bimbingan intensif dan asistensi bagi tim internal perusahaan dalam menyusun laporan keuangan mandiri.',
      price: 3000000,
      duration: '1 Project',
      category: 'Pendampingan',
      isActive: true,
    },
    {
      name: 'Jasa Perpajakan',
      description: 'Layanan lengkap perhitungan, pelaporan, dan konsultasi perpajakan (PPh, PPN, SPT Tahunan/Masa).',
      price: 1500000,
      duration: '1 Bulan',
      category: 'Pajak',
      isActive: true,
    },
    {
      name: 'Jasa Audit Internal',
      description: 'Pemeriksaan independen terhadap sistem pengendalian internal dan kepatuhan operasional perusahaan.',
      price: 5000000,
      duration: '1 Project',
      category: 'Audit',
      isActive: true,
    },
  ];

  for (const service of services) {
    await prisma.servicePackage.create({ data: service });
  }

  console.log('📦 Services created');

  // 4. Create Dummy Order
  await prisma.order.create({
    data: {
      status: 'PENDING_PAYMENT',
      totalAmount: 500000,
      notes: 'Mohon dibantu untuk pembukuan bulan Januari',
      clientId: client.id,
      serviceId: (await prisma.servicePackage.findFirst())?.id || '',
    },
  });

  console.log('📝 Dummy order created');
  console.log('✅ Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });