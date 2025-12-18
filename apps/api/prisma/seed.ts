import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create QueryCount record (required for the app to function)
    await prisma.queryCount.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            total_queries: BigInt(0),
        },
    });

    console.log('✅ Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
