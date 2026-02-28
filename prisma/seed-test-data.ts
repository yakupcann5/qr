import { PrismaClient, Role, SubscriptionStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding test business data...");

  // Premium planı bul
  const premiumPlan = await prisma.plan.findUnique({
    where: { slug: "premium" },
  });

  if (!premiumPlan) {
    throw new Error("Premium plan not found. Run `npx prisma db seed` first.");
  }

  // ============================================
  // TEST KULLANICISI
  // ============================================

  const hashedPassword = await hash("test123456", 12);

  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: hashedPassword,
      name: "Test İşletme Sahibi",
      role: Role.BUSINESS_OWNER,
      emailVerified: true,
      consentGivenAt: new Date(),
    },
  });
  console.log(`User created: ${user.email}`);

  // ============================================
  // TEST İŞLETMESİ
  // ============================================

  const business = await prisma.business.upsert({
    where: { slug: "ornek-kafe" },
    update: {},
    create: {
      userId: user.id,
      name: "Örnek Kafe",
      slug: "ornek-kafe",
      description: "Şehrin en güzel kafesi. Taze kahveler, ev yapımı tatlılar ve sıcak atmosfer.",
      phone: "0212 555 1234",
      address: "Beyoğlu, İstiklal Caddesi No:42, İstanbul",
      taxNumber: "1234567890",
      taxOffice: "Beyoğlu",
      primaryColor: "#8B4513",
      secondaryColor: "#D2691E",
      backgroundColor: "#FFF8F0",
      fontFamily: "Inter",
      menuTemplate: "cafe",
      isActive: true,
    },
  });
  console.log(`Business created: ${business.name} (${business.slug})`);

  // ============================================
  // ABONELİK (TRIAL - 14 gün)
  // ============================================

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  const subscription = await prisma.subscription.upsert({
    where: { businessId: business.id },
    update: {},
    create: {
      businessId: business.id,
      planId: premiumPlan.id,
      status: SubscriptionStatus.TRIAL,
      trialEndsAt,
    },
  });
  console.log(`Subscription created: ${subscription.status} (ends ${trialEndsAt.toLocaleDateString("tr-TR")})`);

  // ============================================
  // KATEGORİLER
  // ============================================

  const categories = [
    {
      name: "Sıcak İçecekler",
      description: "Taze çekilmiş kahveler ve sıcak içecekler",
      sortOrder: 0,
    },
    {
      name: "Soğuk İçecekler",
      description: "Serinleten buzlu içecekler",
      sortOrder: 1,
    },
    {
      name: "Tatlılar",
      description: "Ev yapımı tatlılar ve pastalar",
      sortOrder: 2,
    },
    {
      name: "Kahvaltı",
      description: "Zengin kahvaltı çeşitleri",
      sortOrder: 3,
    },
  ];

  const createdCategories: Record<string, string> = {};

  for (const cat of categories) {
    const existing = await prisma.category.findFirst({
      where: { businessId: business.id, name: cat.name },
    });

    if (existing) {
      createdCategories[cat.name] = existing.id;
      console.log(`Category exists: ${cat.name}`);
    } else {
      const created = await prisma.category.create({
        data: {
          businessId: business.id,
          name: cat.name,
          description: cat.description,
          sortOrder: cat.sortOrder,
          isActive: true,
        },
      });
      createdCategories[cat.name] = created.id;
      console.log(`Category created: ${cat.name}`);
    }
  }

  // ============================================
  // ÜRÜNLER
  // ============================================

  const products = [
    // Sıcak İçecekler
    {
      categoryName: "Sıcak İçecekler",
      name: "Türk Kahvesi",
      description: "Geleneksel Türk kahvesi, lokum ile servis edilir",
      price: 45,
      ingredients: "Kahve çekirdeği, su",
      allergens: [],
      calories: 5,
      preparationTime: 5,
      badges: ["popular"],
      sortOrder: 0,
    },
    {
      categoryName: "Sıcak İçecekler",
      name: "Latte",
      description: "Espresso ve buharla ısıtılmış süt",
      price: 65,
      ingredients: "Espresso, süt",
      allergens: ["lactose"],
      calories: 120,
      preparationTime: 4,
      badges: [],
      sortOrder: 1,
    },
    {
      categoryName: "Sıcak İçecekler",
      name: "Cappuccino",
      description: "Espresso, sıcak süt ve süt köpüğü",
      price: 65,
      ingredients: "Espresso, süt",
      allergens: ["lactose"],
      calories: 110,
      preparationTime: 4,
      badges: [],
      sortOrder: 2,
    },
    {
      categoryName: "Sıcak İçecekler",
      name: "Sıcak Çikolata",
      description: "Belçika çikolatası ile hazırlanan sıcak çikolata",
      price: 55,
      ingredients: "Çikolata, süt, şeker",
      allergens: ["lactose", "gluten"],
      calories: 250,
      preparationTime: 5,
      badges: ["new"],
      sortOrder: 3,
    },

    // Soğuk İçecekler
    {
      categoryName: "Soğuk İçecekler",
      name: "Ice Latte",
      description: "Buzlu espresso ve soğuk süt",
      price: 70,
      ingredients: "Espresso, süt, buz",
      allergens: ["lactose"],
      calories: 130,
      preparationTime: 3,
      badges: ["popular"],
      sortOrder: 0,
    },
    {
      categoryName: "Soğuk İçecekler",
      name: "Limonata",
      description: "Taze sıkılmış limon, nane ve soda",
      price: 50,
      ingredients: "Limon, şeker, nane, soda",
      allergens: [],
      calories: 90,
      preparationTime: 3,
      badges: [],
      sortOrder: 1,
    },
    {
      categoryName: "Soğuk İçecekler",
      name: "Smoothie Bowl",
      description: "Muz, çilek ve yaban mersini ile hazırlanan smoothie",
      price: 85,
      ingredients: "Muz, çilek, yaban mersini, yoğurt",
      allergens: ["lactose"],
      calories: 200,
      preparationTime: 5,
      badges: ["vegan-option"],
      sortOrder: 2,
    },

    // Tatlılar
    {
      categoryName: "Tatlılar",
      name: "San Sebastian Cheesecake",
      description: "Ev yapımı yanık cheesecake",
      price: 95,
      ingredients: "Krem peynir, yumurta, şeker, krema",
      allergens: ["lactose", "eggs", "gluten"],
      calories: 350,
      preparationTime: 0,
      badges: ["popular", "chef-recommendation"],
      sortOrder: 0,
    },
    {
      categoryName: "Tatlılar",
      name: "Brownie",
      description: "Sıcak çikolatalı brownie, dondurma ile servis",
      price: 80,
      ingredients: "Çikolata, un, yumurta, tereyağı",
      allergens: ["lactose", "eggs", "gluten"],
      calories: 400,
      preparationTime: 10,
      badges: [],
      sortOrder: 1,
    },
    {
      categoryName: "Tatlılar",
      name: "Tiramisu",
      description: "İtalyan usulü tiramisu, mascarpone ile",
      price: 90,
      ingredients: "Mascarpone, kahve, savoiardi bisküvi",
      allergens: ["lactose", "eggs", "gluten"],
      calories: 320,
      preparationTime: 0,
      badges: [],
      sortOrder: 2,
    },

    // Kahvaltı
    {
      categoryName: "Kahvaltı",
      name: "Serpme Kahvaltı (2 Kişilik)",
      description: "Zengin serpme kahvaltı tabağı: peynir çeşitleri, zeytin, bal, kaymak, yumurta ve daha fazlası",
      price: 350,
      ingredients: "Beyaz peynir, kaşar, zeytin, bal, kaymak, tereyağı, reçel, menemen, simit",
      allergens: ["lactose", "eggs", "gluten"],
      calories: 800,
      preparationTime: 15,
      badges: ["popular", "for-two"],
      sortOrder: 0,
    },
    {
      categoryName: "Kahvaltı",
      name: "Avokadolu Tost",
      description: "Ekşi mayalı ekmek üzerinde avokado, poşe yumurta ve cherry domates",
      price: 120,
      ingredients: "Avokado, yumurta, ekşi mayalı ekmek, cherry domates",
      allergens: ["eggs", "gluten"],
      calories: 350,
      preparationTime: 10,
      badges: ["new"],
      sortOrder: 1,
    },
    {
      categoryName: "Kahvaltı",
      name: "Granola Bowl",
      description: "Ev yapımı granola, yoğurt, mevsim meyveleri ve bal",
      price: 85,
      ingredients: "Granola, yoğurt, muz, çilek, bal",
      allergens: ["lactose", "nuts"],
      calories: 280,
      preparationTime: 3,
      badges: ["vegan-option"],
      sortOrder: 2,
    },
  ];

  for (const prod of products) {
    const categoryId = createdCategories[prod.categoryName];
    if (!categoryId) {
      console.warn(`Category not found: ${prod.categoryName}`);
      continue;
    }

    const existing = await prisma.product.findFirst({
      where: { businessId: business.id, categoryId, name: prod.name },
    });

    if (existing) {
      console.log(`Product exists: ${prod.name}`);
      continue;
    }

    await prisma.product.create({
      data: {
        categoryId,
        businessId: business.id,
        name: prod.name,
        description: prod.description,
        price: prod.price,
        sortOrder: prod.sortOrder,
        isActive: true,
        isSoldOut: false,
        ingredients: prod.ingredients,
        allergens: prod.allergens,
        calories: prod.calories,
        preparationTime: prod.preparationTime,
        badges: prod.badges,
      },
    });
    console.log(`Product created: ${prod.name} (₺${prod.price})`);
  }

  // ============================================
  // DİLLER
  // ============================================

  const language = await prisma.businessLanguage.upsert({
    where: {
      businessId_languageCode: {
        businessId: business.id,
        languageCode: "en",
      },
    },
    update: {},
    create: {
      businessId: business.id,
      languageCode: "en",
      languageName: "English",
      isActive: true,
    },
  });
  console.log(`Language added: ${language.languageName}`);

  console.log("\n✓ Test data seeding completed!");
  console.log(`\nGiriş bilgileri:`);
  console.log(`  Email: test@example.com`);
  console.log(`  Şifre: test123456`);
  console.log(`\nMenü URL: /menu/ornek-kafe`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
