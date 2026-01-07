import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const tachyon = await prisma.user.create({
    data: { name: "Tachyon", email: "tachyon@gmail.com" },
  });

  const firefly = await prisma.user.create({
    data: { name: "Firefly", email: "ff@gmail.com" },
  });

  const cafe = await prisma.user.create({
    data: { name: "Cafe", email: "nodecaf@gmail.com" },
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
