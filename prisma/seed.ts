import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌟 Seeding AI Astro Coach database...");

  // Create test users
  const password = await hash("password123", 12);

  const alice = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      email: "alice@example.com",
      name: "Alice Star",
      password,
      profile: {
        create: {
          birthDate: "1990-03-25",
          sign: "pisces",
          focusArea: "career",
          mood: "motivated",
          struggle: "patience",
        },
      },
      subscription: {
        create: {
          tier: "PREMIUM",
          aiMessagesLimit: 50,
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      email: "bob@example.com",
      name: "Bob Moon",
      password,
      profile: {
        create: {
          birthDate: "1995-07-15",
          sign: "Cancer",
          focusArea: "love",
          mood: "reflective",
          struggle: "vulnerability",
        },
      },
      subscription: {
        create: {
          tier: "FREE",
          aiMessagesLimit: 3,
        },
      },
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: "carol@example.com" },
    update: {},
    create: {
      email: "carol@example.com",
      name: "Carol Nova",
      password,
      profile: {
        create: {
          birthDate: "1988-11-08",
          sign: "Scorpio",
          focusArea: "peace",
          mood: "intense",
          struggle: "trust",
        },
      },
      subscription: {
        create: {
          tier: "FREE",
          aiMessagesLimit: 3,
        },
      },
    },
  });

  console.log("✅ Created test users:", { alice: alice.email, bob: bob.email, carol: carol.email });
  console.log("\n📧 Login credentials for all users:");
  console.log("   Email: alice@example.com / bob@example.com / carol@example.com");
  console.log("   Password: password123");
  console.log("\n🌟 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
