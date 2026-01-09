import { Request, Response, NextFunction } from "express";
import { prisma } from "../connection/client";
import AppError from "../utils/app-error";

// Helper to calculate total stock per product
const calculateTotalStock = (stocks: { quantity: number }[]) =>
  stocks.reduce((sum, s) => sum + s.quantity, 0);

// GET all products (hide supplier info)
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      sortBy = "price",
      order = "asc",
      limit = "10",
      offset = "0",
    } = req.query;

    const products = await prisma.product.findMany({
      include: {
        stocks: true, // only need quantity to calculate totalStock
      },
      where: {
        price: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? Number(maxPrice) : undefined,
        },
      },
      take: Number(limit),
      skip: Number(offset),
    });

    const filteredProducts = products
      .map((p) => ({
        ...p,
        totalStock: calculateTotalStock(p.stocks),
      }))
      .filter((p) => {
        const gte = minStock ? p.totalStock >= Number(minStock) : true;
        const lte = maxStock ? p.totalStock <= Number(maxStock) : true;
        return gte && lte;
      });

    filteredProducts.sort((a, b) => {
      if (sortBy === "totalStock") {
        return order === "asc" ? a.totalStock - b.totalStock : b.totalStock - a.totalStock;
      } else {
        return order === "asc" ? a.price - b.price : b.price - a.price;
      }
    });

    res.status(200).json({
      message: "List of products",
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
      },
      data: filteredProducts.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        totalStock: p.totalStock,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// GET single product (hide supplier info)
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: { stocks: true }, // just to calculate totalStock
    });

    if (!product) return next(new AppError("Product not found", 404));

    const totalStock = calculateTotalStock(product.stocks);

    res.status(200).json({
      message: "Product fetched successfully",
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        totalStock,
      },
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE product (only supplier who owns the product)
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = res.locals.currentUser;

    if (!currentUser || currentUser.role !== "supplier") {
      return next(new AppError("Unauthorized: Supplier only", 401));
    }

    const id = Number(req.params.id);
    const { name, description, price } = req.body;

    // Find product and its stocks
    const product = await prisma.product.findUnique({
      where: { id },
      include: { stocks: true },
    });

    if (!product) return next(new AppError("Product not found", 404));

    // Find supplier
    const supplier = await prisma.supplier.findUnique({
      where: { userId: currentUser.id },
    });

    const ownsProduct = product.stocks.some((s) => s.supplierId === supplier?.id);
    if (!ownsProduct) return next(new AppError("You do not own this product", 403));

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, description, price },
    });

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE product (only supplier who owns the product)
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = res.locals.currentUser;

    if (!currentUser || currentUser.role !== "supplier") {
      return next(new AppError("Unauthorized: Supplier only", 401));
    }

    const id = Number(req.params.id);

    // Find product and its stocks
    const product = await prisma.product.findUnique({
      where: { id },
      include: { stocks: true },
    });

    if (!product) return next(new AppError("Product not found", 404));

    // Check supplier ownership
    const supplier = await prisma.supplier.findUnique({
      where: { userId: currentUser.id },
    });

    const ownsProduct = product.stocks.some((s) => s.supplierId === supplier?.id);
    if (!ownsProduct) return next(new AppError("You do not own this product", 403));

    await prisma.$transaction([
      prisma.productStock.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
