import { Request, Response } from "express";
import { prisma } from "../connection/client";

// GET all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();

    res.status(200).json({
      message: "List of all products",
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error,
    });
  }
};

//GET product by ID
export const getProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
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
    const { productid, productname, content, price } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        productid,
        productname,
        content,
        price,
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

// UPDATE product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { productid, productname, content, price } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        productid,
        productname,
        content,
        price,
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

// DELETE product by ID
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
