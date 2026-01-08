import { Request, Response } from "express";
import { prisma } from "../connection/client";
import AppError from "../utils/app-error";

export const updateSupplierStock = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const { stocks } = req.body;

    // Validate body
    if (!Array.isArray(stocks) || stocks.length === 0) {
      return next(new AppError("Stocks must be a non-empty array", 400));
    }

    // Validate each stock item
    for (const stock of stocks) {
      if (!stock.productId || !stock.supplierId || stock.quantity == null) {
        return next(
          new AppError(
            "Each stock item must have productId, supplierId, and quantity",
            400
          )
        );
      }

      if (stock.quantity <= 0) {
        return next(
          new AppError("Stock quantity must be greater than 0", 400)
        );
      }
    }

    // 🔹 Collect unique product & supplier IDs
    const productIds = [...new Set(stocks.map(s => s.productId))];
    const supplierIds = [...new Set(stocks.map(s => s.supplierId))];

    // 🔹 Validate products exist
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });

    if (existingProducts.length !== productIds.length) {
      return next(new AppError("One or more productIds are invalid", 400));
    }

    // 🔹 Validate suppliers exist
    const existingSuppliers = await prisma.supplier.findMany({
      where: { id: { in: supplierIds } },
      select: { id: true },
    });

    if (existingSuppliers.length !== supplierIds.length) {
      return next(new AppError("One or more supplierIds are invalid", 400));
    }

    // 🔹 Transaction for stock update
    await prisma.$transaction(
      stocks.map(stock =>
        prisma.productStock.upsert({
          where: {
            productId_supplierId: {
              productId: stock.productId,
              supplierId: stock.supplierId,
            },
          },
          update: {
            quantity: { increment: stock.quantity },
          },
          create: {
            productId: stock.productId,
            supplierId: stock.supplierId,
            quantity: stock.quantity,
          },
        })
      )
    );

    res.status(200).json({
      status: "success",
      message: "Stock updated successfully",
      updatedStocks: stocks,
    });
  } catch (error) {
    next(error);
  }
};