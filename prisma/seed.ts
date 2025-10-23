import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seeding...");

  // Hash passwords
  const adminPassword = await hash("admin123", 12);
  const userPassword = await hash("user123", 12);

  // Upsert Admin User
  // `upsert` will create the user if they don't exist, or do nothing if they do.
  // This prevents errors if you run the seed script multiple times.
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

// Execute the main function and handle errors
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  });
