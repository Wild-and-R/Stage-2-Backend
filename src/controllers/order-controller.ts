import { Request, Response } from "express";
import { prisma } from "../connection/client";

export const getOrderSummary = async (req: Request, res: Response) => {
  try {
    const { limit = "10", offset = "0" } = req.query;

    // Group by user + product
    const groupedOrders = await prisma.order.groupBy({
      by: ["userId", "productId"],
      _sum: {
        quantity: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        userId: "asc",
      },
      take: Number(limit),
      skip: Number(offset),
    });

    // Collect IDs
    const userIds = [...new Set(groupedOrders.map(o => o.userId))];
    const productIds = [...new Set(groupedOrders.map(o => o.productId))];

    // Fetch users
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    // Fetch products
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    // Build summary per user
    const summaryMap = new Map<number, any>();

    for (const row of groupedOrders) {
      const user = users.find(u => u.id === row.userId);
      const product = products.find(p => p.id === row.productId);

      if (!summaryMap.has(row.userId)) {
        summaryMap.set(row.userId, {
          userId: row.userId,
          name: user?.name ?? null,
          email: user?.email ?? null,
          totalOrders: 0,
          totalQuantity: 0,
          products: [],
        });
      }

      const summary = summaryMap.get(row.userId);

      summary.totalOrders += row._count.id;
      summary.totalQuantity += row._sum.quantity ?? 0;

      summary.products.push({
        productId: row.productId,
        name: product?.name ?? null,
        quantity: row._sum.quantity ?? 0,
      });
    }

    res.status(200).json({
      message: "Order summary per user",
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
      },
      data: Array.from(summaryMap.values()),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching order summary",
      error,
    });
  }
};
