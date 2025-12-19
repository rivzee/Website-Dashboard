import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const payment = await prisma.payment.findFirst({
        orderBy: { createdAt: 'desc' }
    });

    console.log('--- URL BUKTI TERAKHIR ---');
    console.log(payment?.proofUrl || 'TIDAK ADA DATA');
    console.log('--------------------------');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
