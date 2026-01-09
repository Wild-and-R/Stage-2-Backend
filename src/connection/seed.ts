import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords
  const tachyonPassword = await bcrypt.hash("lightspeed", 10);
  const fireflyPassword = await bcrypt.hash("lifebegetsdeath", 10);
  const cafePassword = await bcrypt.hash("peakshadow", 10);

  // Create users
  const tachyon = await prisma.user.create({
    data: {
      name: "Tachyon",
      email: "tachyon@gmail.com",
      password: tachyonPassword,
      role: "admin",
    },
  });

  const firefly = await prisma.user.create({
    data: {
      name: "Firefly",
      email: "ff@gmail.com",
      password: fireflyPassword,
      role: "user",
    },
  });

  const cafe = await prisma.user.create({
    data: {
      name: "Cafe",
      email: "nodecaf@gmail.com",
      password: cafePassword,
      role: "user",
    },
  });

  // Seed posts with comments
  await prisma.post.create({
    data: {
      title: "Tachyon's Transmigration",
      content: "This is my adventure throughout the whole universe...",
      userId: tachyon.id,
      comments: {
        create: [
          { content: "I wish I could travel too.", userId: firefly.id },
          { content: "Looks like you're having fun.", userId: cafe.id },
          { content: "Stop stealing my coffee.", userId: cafe.id },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "Thank you for always being by side.",
      content: "The two of you always being by my side in the Hospital...",
      userId: firefly.id,
      comments: {
        create: [
          { content: "I'll always be there.", userId: cafe.id },
          { content: "I promise I'll find a cure.", userId: tachyon.id },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "List of Greatest Coffee in the World",
      content: "Mine",
      userId: cafe.id,
      comments: {
        create: [
          { content: "Truth", userId: tachyon.id },
          { content: "You're always so confident.", userId: firefly.id },
        ],
      },
    },
  });

  await prisma.post.create({
    data: {
      title: "View from Zenith",
      content: "This is from the top of the mountain located in...",
      userId: cafe.id,
      comments: {
        create: [
          { content: "I wish I could go there too.", userId: firefly.id },
          { content: "Someday, the three of us will.", userId: tachyon.id },
        ],
      },
    },
  });

  // Admin-only post
  await prisma.post.create({
    data: {
      title: "The Search for the Cure",
      content: "No progress at all so far. Seems like I have to resort to...",
      userId: tachyon.id,
      isAdminOnly: true,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
