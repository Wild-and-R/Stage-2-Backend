import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.order.deleteMany();
  await prisma.productStock.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const users = await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@gmail.com", points: 100 },
      { name: "Ayu", email: "ayu@gmail.com", points: 200 },
      { name: "Andini", email: "andini@gmail.com", points: 300 },
    ],
  });

  // Create Products
  const keyboard = await prisma.product.create({
    data: {
      name: "Keyboard",
      description: "Mechanical keyboard",
      price: 350_000,
    },
  });

  const mouse = await prisma.product.create({
    data: {
      name: "Mouse",
      description: "Wireless mouse",
      price: 30_000,
    },
  });

  const monitor = await prisma.product.create({
    data: {
      name: "Monitor",
      description: "24 inch monitor",
      price: 700_000,
    },
  });

  const laptop = await prisma.product.create({
    data: {
      name: "Laptop",
      description: "Gaming laptop",
      price: 8_050_000,
    },
  });

  // Create Suppliers
  const illias = await prisma.supplier.create({
    data: {
      name: "Illias Inc.",
      quantity: 300,
    },
  });

  const tachyon = await prisma.supplier.create({
    data: {
      name: "Tachyon Co.",
      quantity: 500,
    },
  });

  const nothingPersonal = await prisma.supplier.create({
    data: {
      name: "Nothing Personal",
      quantity: 200,
    },
  });

  const itIsPersonal = await prisma.supplier.create({
    data: {
      name: "It is Personal",
      quantity: 201,
    },
  });

  const seeEverything = await prisma.supplier.create({
    data: {
      name: "See Everything",
      quantity: 400,
    },
  });

  // Create Product Stocks
  await prisma.productStock.createMany({
    data: [
      // Keyboard
      {
        productId: keyboard.id,
        supplierId: illias.id,
        quantity: 300,
      },

      // Laptop
      {
        productId: laptop.id,
        supplierId: tachyon.id,
        quantity: 500,
      },

      // Mouse (multiple suppliers)
      {
        productId: mouse.id,
        supplierId: nothingPersonal.id,
        quantity: 200,
      },
      {
        productId: mouse.id,
        supplierId: itIsPersonal.id,
        quantity: 201,
      },

      // Monitor
      {
        productId: monitor.id,
        supplierId: seeEverything.id,
        quantity: 400,
      },
    ],
  });

  // Create Orders
  const allUsers = await prisma.user.findMany();
  const allProducts = await prisma.product.findMany();

  await prisma.order.createMany({
    data: [
      {
        userId: allUsers[0].id,
        productId: allProducts[0].id,
        quantity: 2,
      },
      {
        userId: allUsers[0].id,
        productId: allProducts[1].id,
        quantity: 1,
      },
      {
        userId: allUsers[1].id,
        productId: allProducts[2].id,
        quantity: 1,
      },
      {
        userId: allUsers[2].id,
        productId: allProducts[3].id,
        quantity: 4,
      },
    ],
  });

  console.log("Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
