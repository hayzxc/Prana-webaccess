const { PrismaClient } = require("../generated/prisma");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database seeding...");

    // Hash passwords
    const adminPassword = await hash("admin123", 12);
    const userPassword = await hash("user123", 12);

    // Upsert Admin User
    const admin = await prisma.user.upsert({
        where: { email: "admin@prana.com" },
        update: {},
        create: {
            email: "admin@prana.com",
            name: "Admin Prana",
            password: adminPassword,
            role: "ADMIN",
        },
    });

    // Upsert Basic User
    const user = await prisma.user.upsert({
        where: { email: "user@prana.com" },
        update: {},
        create: {
            email: "user@prana.com",
            name: "User Prana",
            password: userPassword,
            role: "USER",
        },
    });

    console.log("✅ Seeding finished.");
    console.log({ admin, user });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
