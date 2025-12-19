import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Memeriksa Koneksi Database...');

    try {
        const userCount = await prisma.user.count();
        console.log(`✅ Koneksi BERHASIL!`);
        console.log(`📊 Jumlah User: ${userCount}`);

        if (userCount > 0) {
            const users = await prisma.user.findMany({
                select: { email: true, role: true, fullName: true }
            });
            console.log('📋 Daftar User:');
            console.table(users);
        } else {
            console.log('⚠️ Database KOSONG! Perlu di-seed.');
        }

    } catch (error) {
        console.error('❌ Koneksi GAGAL:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
