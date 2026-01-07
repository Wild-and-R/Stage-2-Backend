import { Request, Response } from "express";
import { prisma } from "../connection/client";

// GET all products with filtering, sorting, pagination
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      sortBy = "price", // price | stock
      order = "asc",    // asc | desc
      limit = "10",
      offset = "0",
    } = req.query;

    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? Number(maxPrice) : undefined,
        },
        stock: {
          gte: minStock ? Number(minStock) : undefined,
          lte: maxStock ? Number(maxStock) : undefined,
        },
      },
      orderBy: {
        [sortBy as string]: order,
      },
      take: Number(limit),
      skip: Number(offset),
    });

    res.status(200).json({
      message: "List of products",
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
      },
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error,
    });
  }
};

// GET product by ID
export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error,
    });
  }
};

// CREATE product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
      },
    });

    res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error,
    });
  }
};

// UPDATE product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, stock } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        stock,
      },
    });

    res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(404).json({
      message: "Product not found",
      error,
    });
  }
};

// DELETE product
export const deleteProduct = async (req: Request, res: Response) => {
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
    res.status(404).json({
      message: "Product not found",
      error,
    });
  }
};

