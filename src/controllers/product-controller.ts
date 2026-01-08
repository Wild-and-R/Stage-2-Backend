import { Request, Response } from "express";
import { prisma } from "../connection/client";
import AppError from "../utils/app-error";

// Helper to calculate total stock per product
const calculateTotalStock = (stocks: { quantity: number }[]) =>
  stocks.reduce((sum, s) => sum + s.quantity, 0);

// GET all products with filtering, sorting, pagination
export const getProducts = async (req: Request, res: Response, next: any) => {
  try {
    const {
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      sortBy = "price", // price | totalStock
      order = "asc",    // asc | desc
      limit = "10",
      offset = "0",
    } = req.query;

    // Fetch products with stocks
    const products = await prisma.product.findMany({
      include: {
        stocks: {
          include: {
            supplier: true,
          },
        },
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

    // Calculate total stock per product
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

    // Sorting
    filteredProducts.sort((a, b) => {
      if (sortBy === "totalStock") {
        return order === "asc" ? a.totalStock - b.totalStock : b.totalStock - a.totalStock;
      } else {
        // default price sorting
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
        suppliers: p.stocks.map((s) => ({
          supplierId: s.supplier.id,
          supplierName: s.supplier.name,
          suppliedQuantity: s.quantity,
        })),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// GET product by ID (with total stock and suppliers)
export const getProduct = async (req: Request, res: Response, next: any) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        stocks: {
          include: {
            supplier: true,
          },
        },
      },
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
        suppliers: product.stocks.map((s) => ({
          supplierId: s.supplier.id,
          supplierName: s.supplier.name,
          suppliedQuantity: s.quantity,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// CREATE product (stock added via ProductStock separately)
export const createProduct = async (req: Request, res: Response, next: any) => {
  try {
    const { name, description, price } = req.body;

    const newProduct = await prisma.product.create({
      data: { name, description, price },
    });

    res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE product (stock updated via ProductStock separately)
export const updateProduct = async (req: Request, res: Response, next: any) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, description, price },
    });

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(new AppError("Product not found", 404));
  }
};

// DELETE product
export const deleteProduct = async (req: Request, res: Response, next: any) => {
  try {
    const id = Number(req.params.id);

    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    res.status(200).json({
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    next(new AppError("Product not found", 404));
  }
};
