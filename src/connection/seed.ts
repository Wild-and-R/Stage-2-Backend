import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // clear old data 
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // create Users
  await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@gmail.com" },
      { name: "Ayu", email: "ayu@gmail.com" },
      { name: "Andini", email: "andini@gmail.com" },
    ],
  });

  // create Products
  await prisma.product.createMany({
    data: [
      {
        name: "Keyboard",
        description: "Mechanical keyboard",
        price: 350_000,
        stock: 10,
      },
      {
        name: "Mouse",
        description: "Wireless mouse",
        price: 30_000,
        stock: 15,
      },
      {
        name: "Monitor",
        description: "24 inch monitor",
        price: 700_000,
        stock: 20,
      },
      {
        name: "Laptop",
        description: "Gaming laptop",
        price: 8_050_000,
        stock: 5,
      },
    ],
  });

  // create Orders
  const users = await prisma.user.findMany();
  const products = await prisma.product.findMany();
  // using this to read the userId and productId from the Database
  await prisma.order.createMany({
  data: [
    {
      userId: users[0].id,
      productId: products[0].id,
      quantity: 2,
    },
    {
      userId: users[0].id,
      productId: products[1].id,
      quantity: 1,
    },
    {
      userId: users[1].id,
      productId: products[2].id,
      quantity: 1,
    },
    {
      userId: users[2].id,
      productId: products[3].id,
      quantity: 4,
    },
  ],
});

  console.log("Seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
