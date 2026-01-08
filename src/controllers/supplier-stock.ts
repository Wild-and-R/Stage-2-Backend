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
      if (!stock.productId || !stock.supplierId || !stock.quantity) {
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

    // Use a transaction to update/create stock for all products/suppliers
    await prisma.$transaction(
      stocks.map((stock) =>
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