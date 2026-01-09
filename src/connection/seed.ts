import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clear old data
  await prisma.order.deleteMany();
  await prisma.productStock.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Regular Users (shared password)
  const userPassword = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.create({
    data: { name: "Alice", email: "alice@gmail.com", points: 100, password: userPassword, role: "user" },
  });

  const ayu = await prisma.user.create({
    data: { name: "Ayu", email: "ayu@gmail.com", points: 200, password: userPassword, role: "user" },
  });

  const andini = await prisma.user.create({
    data: { name: "Andini", email: "andini@gmail.com", points: 300, password: userPassword, role: "user" },
  });

  // Supplier Users (unique passwords)
  const illiasUser = await prisma.user.create({
    data: {
      name: "Illias Supplier",
      email: "illias@supplier.com",
      points: 0,
      password: await bcrypt.hash("illias123", 10),
      role: "supplier",
    },
  });

  const tachyonUser = await prisma.user.create({
    data: {
      name: "Tachyon Supplier",
      email: "tachyon@supplier.com",
      points: 0,
      password: await bcrypt.hash("tachyon123", 10),
      role: "supplier",
    },
  });

  const nothingPersonalUser = await prisma.user.create({
    data: {
      name: "Nothing Personal Supplier",
      email: "nothingpersonal@supplier.com",
      points: 0,
      password: await bcrypt.hash("nothing123", 10),
      role: "supplier",
    },
  });

  const itIsPersonalUser = await prisma.user.create({
    data: {
      name: "It Is Personal Supplier",
      email: "itispersonal@supplier.com",
      points: 0,
      password: await bcrypt.hash("personal123", 10),
      role: "supplier",
    },
  });

  const seeEverythingUser = await prisma.user.create({
    data: {
      name: "See Everything Supplier",
      email: "seeeverything@supplier.com",
      points: 0,
      password: await bcrypt.hash("see123", 10),
      role: "supplier",
    },
  });

  // Create Products
  const keyboard = await prisma.product.create({
    data: { name: "Keyboard", description: "Mechanical keyboard", price: 350_000 },
  });

  const mouse = await prisma.product.create({
    data: { name: "Mouse", description: "Wireless mouse", price: 30_000 },
  });

  const monitor = await prisma.product.create({
    data: { name: "Monitor", description: "24 inch monitor", price: 700_000 },
  });

  const laptop = await prisma.product.create({
    data: { name: "Laptop", description: "Gaming laptop", price: 8_050_000 },
  });

  // Create Suppliers (linked to supplier users)
  const illias = await prisma.supplier.create({
    data: { name: "Illias Inc.", userId: illiasUser.id },
  });

  const tachyon = await prisma.supplier.create({
    data: { name: "Tachyon Co.", userId: tachyonUser.id },
  });

  const nothingPersonal = await prisma.supplier.create({
    data: { name: "Nothing Personal", userId: nothingPersonalUser.id },
  });

  const itIsPersonal = await prisma.supplier.create({
    data: { name: "It is Personal", userId: itIsPersonalUser.id },
  });

  const seeEverything = await prisma.supplier.create({
    data: { name: "See Everything", userId: seeEverythingUser.id },
  });

  // Create Product Stocks
  await prisma.productStock.createMany({
    data: [
      { productId: keyboard.id, supplierId: illias.id, quantity: 300 },
      { productId: laptop.id, supplierId: tachyon.id, quantity: 500 },
      { productId: mouse.id, supplierId: nothingPersonal.id, quantity: 200 },
      { productId: mouse.id, supplierId: itIsPersonal.id, quantity: 201 },
      { productId: monitor.id, supplierId: seeEverything.id, quantity: 400 },
    ],
  });

  // Create Orders
  await prisma.order.createMany({
    data: [
      { userId: alice.id, productId: keyboard.id, quantity: 2 },
      { userId: alice.id, productId: mouse.id, quantity: 1 },
      { userId: ayu.id, productId: monitor.id, quantity: 1 },
      { userId: andini.id, productId: laptop.id, quantity: 4 },
    ],
  });

  console.log("Seeding completed successfully");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
