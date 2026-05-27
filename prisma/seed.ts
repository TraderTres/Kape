import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Kape database...");

  // ─── Users ─────────────────────────────────────────────────
  const hashedUserPw = await bcrypt.hash("password123", 12);
  const hashedAdminPw = await bcrypt.hash("admin123", 12);

  const regularUser = await prisma.user.upsert({
    where: { email: "user@kape.ph" },
    update: {},
    create: {
      name: "Maria Santos",
      email: "user@kape.ph",
      password: hashedUserPw,
      role: "USER",
      loyaltyPoints: 350,
      loyaltyTier: "BRONZE",
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@kape.ph" },
    update: {},
    create: {
      name: "Admin Kape",
      email: "admin@kape.ph",
      password: hashedAdminPw,
      role: "ADMIN",
      loyaltyPoints: 0,
      loyaltyTier: "PLATINUM",
    },
  });

  console.log(`✅ Users created: ${regularUser.email}, ${adminUser.email}`);

  // ─── Addresses ──────────────────────────────────────────────
  const address = await prisma.address.upsert({
    where: { id: "seed-address-1" },
    update: {},
    create: {
      id: "seed-address-1",
      userId: regularUser.id,
      label: "Home",
      street: "123 Mabini Street",
      barangay: "Barangay 1",
      city: "Caloocan",
      province: "Metro Manila",
      zipCode: "1400",
      isDefault: true,
    },
  });

  console.log(`✅ Address created for ${regularUser.name}`);

  // ─── Coffees ───────────────────────────────────────────────
  const coffees = await Promise.all([
    prisma.coffee.upsert({
      where: { slug: "sagada-arabica" },
      update: {},
      create: {
        name: "Sagada Arabica",
        slug: "sagada-arabica",
        origin: "SAGADA",
        roastLevel: "MEDIUM",
        description:
          "Grown at 1,500+ meters in the Cordillera mountains of Sagada. This exceptional Arabica showcases the terroir of Mountain Province with bright acidity and complex sweetness.",
        flavorNotes: ["Citrus", "Dark Chocolate", "Jasmine", "Brown Sugar"],
        pricePerBag: 450,
        bagWeightGrams: 250,
        imageUrl: "/sagada.png",
        stockLevel: 120,
        isAvailable: true,
        isFeatured: true,
      },
    }),
    prisma.coffee.upsert({
      where: { slug: "kapeng-barako" },
      update: {},
      create: {
        name: "Kapeng Barako",
        slug: "kapeng-barako",
        origin: "BARAKO",
        roastLevel: "DARK",
        description:
          "The iconic Liberica variety from Batangas — bold, full-bodied, with an unmistakable anise aroma. A cultural treasure and the coffee of Philippine heritage.",
        flavorNotes: ["Bold", "Earthy", "Anise", "Dark Fruit"],
        pricePerBag: 380,
        bagWeightGrams: 250,
        imageUrl: "/barako.png",
        stockLevel: 85,
        isAvailable: true,
        isFeatured: true,
      },
    }),
    prisma.coffee.upsert({
      where: { slug: "mount-apo-reserve" },
      update: {},
      create: {
        name: "Mount Apo Reserve",
        slug: "mount-apo-reserve",
        origin: "APO",
        roastLevel: "LIGHT",
        description:
          "Single-origin Arabica from the slopes of Mount Apo, the highest peak in the Philippines. Volcanic soil imparts incredible mineral clarity and stone fruit sweetness.",
        flavorNotes: ["Stone Fruit", "Honey", "Jasmine", "Bergamot"],
        pricePerBag: 520,
        bagWeightGrams: 200,
        imageUrl: "/apo.png",
        stockLevel: 45,
        isAvailable: true,
        isFeatured: false,
      },
    }),
    prisma.coffee.upsert({
      where: { slug: "benguet-blend" },
      update: {},
      create: {
        name: "Benguet Blend",
        slug: "benguet-blend",
        origin: "BENGUET",
        roastLevel: "MEDIUM_DARK",
        description:
          "A smooth medium-dark roast from Benguet's high-altitude farms. Balanced sweetness with a clean finish — perfect for everyday drinking.",
        flavorNotes: ["Caramel", "Nuts", "Mild Spice"],
        pricePerBag: 420,
        bagWeightGrams: 250,
        imageUrl: "/sagada.png",
        stockLevel: 15,
        isAvailable: true,
        isFeatured: false,
      },
    }),
  ]);

  console.log(`✅ ${coffees.length} coffees seeded`);

  // ─── Loyalty Tasks ─────────────────────────────────────────
  const tasks = await Promise.all([
    prisma.loyaltyTask.upsert({
      where: { id: "task-referral" },
      update: {},
      create: {
        id: "task-referral",
        title: "Refer a Friend",
        description: "Share your referral link and earn big points when a friend subscribes for the first time.",
        pointValue: 200,
        taskType: "REFERRAL",
        isRepeatable: false,
        isActive: true,
        iconName: "Users",
      },
    }),
    prisma.loyaltyTask.upsert({
      where: { id: "task-review" },
      update: {},
      create: {
        id: "task-review",
        title: "Write a Review",
        description: "Leave an honest review for one of your subscribed coffees and help the community discover great beans.",
        pointValue: 100,
        taskType: "REVIEW",
        isRepeatable: false,
        isActive: true,
        iconName: "MessageSquare",
      },
    }),
    prisma.loyaltyTask.upsert({
      where: { id: "task-social" },
      update: {},
      create: {
        id: "task-social",
        title: "Share on Socials",
        description: "Post about your Kape experience on Instagram or Facebook with #KapeSubscription and tag us!",
        pointValue: 75,
        taskType: "SOCIAL_SHARE",
        isRepeatable: true,
        isActive: true,
        iconName: "Share2",
      },
    }),
    prisma.loyaltyTask.upsert({
      where: { id: "task-survey" },
      update: {},
      create: {
        id: "task-survey",
        title: "Complete Our Survey",
        description: "Help us improve by filling out our quick 5-minute product satisfaction survey.",
        pointValue: 50,
        taskType: "SURVEY",
        isRepeatable: false,
        isActive: true,
        iconName: "ClipboardList",
      },
    }),
    prisma.loyaltyTask.upsert({
      where: { id: "task-anniversary" },
      update: {},
      create: {
        id: "task-anniversary",
        title: "1-Year Anniversary",
        description: "Celebrate one full year as a Kape subscriber and receive a special bonus reward.",
        pointValue: 500,
        taskType: "ANNIVERSARY",
        isRepeatable: false,
        isActive: true,
        iconName: "Calendar",
      },
    }),
    prisma.loyaltyTask.upsert({
      where: { id: "task-purchase" },
      update: {},
      create: {
        id: "task-purchase",
        title: "Your First Delivery",
        description: "Receive your very first Kape subscription delivery and embark on your specialty coffee journey.",
        pointValue: 150,
        taskType: "PURCHASE",
        isRepeatable: false,
        isActive: true,
        iconName: "ShoppingCart",
      },
    }),
  ]);

  console.log(`✅ ${tasks.length} loyalty tasks seeded`);

  // ─── Sample completed task for regular user ─────────────────
  await prisma.userTask.upsert({
    where: {
      userId_taskId: {
        userId: regularUser.id,
        taskId: "task-social",
      },
    },
    update: {},
    create: {
      userId: regularUser.id,
      taskId: "task-social",
    },
  });

  console.log("✅ Sample completed task for demo user");

  // ─── Sample subscription ────────────────────────────────────
  const nextDelivery = new Date();
  nextDelivery.setDate(nextDelivery.getDate() + 14);

  await prisma.subscription.upsert({
    where: { id: "seed-subscription-1" },
    update: {},
    create: {
      id: "seed-subscription-1",
      userId: regularUser.id,
      coffeeId: coffees[0].id,
      addressId: address.id,
      tier: "BIWEEKLY",
      status: "ACTIVE",
      nextDeliveryAt: nextDelivery,
      priceAtSubscription: 450,
    },
  });

  console.log("✅ Sample subscription created");
  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Demo credentials:");
  console.log("   User:  user@kape.ph / password123");
  console.log("   Admin: admin@kape.ph / admin123\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
