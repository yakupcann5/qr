import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ============================================
  // PLANLAR
  // ============================================

  const starter = await prisma.plan.upsert({
    where: { slug: "baslangic" },
    update: {},
    create: {
      name: "Başlangıç",
      slug: "baslangic",
      price: 999.0,
      maxLanguages: 1,
      hasImages: false,
      hasDetailFields: false,
      hasCustomQR: false,
      allowedTemplates: ["classic"],
    },
  });
  console.log(`Plan created: ${starter.name}`);

  const professional = await prisma.plan.upsert({
    where: { slug: "profesyonel" },
    update: {},
    create: {
      name: "Profesyonel",
      slug: "profesyonel",
      price: 1999.0,
      maxLanguages: 3,
      hasImages: true,
      hasDetailFields: true,
      hasCustomQR: true,
      allowedTemplates: ["classic"],
    },
  });
  console.log(`Plan created: ${professional.name}`);

  const premium = await prisma.plan.upsert({
    where: { slug: "premium" },
    update: {},
    create: {
      name: "Premium",
      slug: "premium",
      price: 2999.0,
      maxLanguages: -1,
      hasImages: true,
      hasDetailFields: true,
      hasCustomQR: true,
      allowedTemplates: ["classic"],
    },
  });
  console.log(`Plan created: ${premium.name}`);

  // ============================================
  // SUPER ADMIN
  // ============================================

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is required for seeding");
  }

  const hashedPassword = await hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@qrmenu.com" },
    update: {},
    create: {
      email: "admin@qrmenu.com",
      password: hashedPassword,
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
      emailVerified: true,
    },
  });
  console.log(`Super Admin created: ${admin.email}`);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
