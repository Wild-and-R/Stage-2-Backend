import { Request, Response, NextFunction } from "express";
import { prisma } from "../connection/client";
import AppError from "../utils/app-error";
import { signToken } from "../utils/jwt";
import bcrypt from "bcryptjs";
import path from "path";

export const supplierLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { supplier: true }, // include supplier info
    });

    // Validate user exists and is a supplier
    if (!user || user.role !== "supplier" || !user.supplier) {
      return next(new AppError("Invalid email or password", 401));
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AppError("Invalid email or password", 401));
    }

    // Sign JWT token
    const token = signToken({ id: user.id, role: "supplier" });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      supplier: {
        id: user.supplier.id,
        name: user.supplier.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /suppliers/products
export const getSupplierProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = res.locals.currentUser;

    if (!currentUser || currentUser.role !== "supplier") {
      return next(new AppError("Unauthorized: Supplier access only", 401));
    }

    // Fetch all products with their stocks and suppliers
    const products = await prisma.product.findMany({
      include: {
        stocks: {
          include: {
            supplier: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    // Map data to response format, including totalStock
    const data = products.map((product) => {
      const totalStock = product.stocks.reduce((sum, stock) => sum + stock.quantity, 0);

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        totalStock,
        suppliers: product.stocks.map((stock) => ({
          supplierId: stock.supplier.id,
          supplierName: stock.supplier.name,
          quantity: stock.quantity,
        })),
      };
    });

    res.status(200).json({
      status: "success",
      message: "Products and stocks fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

// POST /products/add
export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = res.locals.currentUser;

    if (!currentUser || currentUser.role !== "supplier") {
      return next(new AppError("Unauthorized: Supplier access only", 401));
    }

    const { name, description, price, initialStock } = req.body;

    // Validate product name
    if (!name || name.trim().length < 3) {
      return next(new AppError("Product name must be at least 3 characters long", 400));
    }

    // Validate price
    if (price == null || typeof price !== "number" || price < 0) {
      return next(new AppError("Price must be a non-negative number", 400));
    }

    // Validate initial stock
    if (initialStock == null || typeof initialStock !== "number" || initialStock <= 0) {
      return next(new AppError("Initial stock must be a number greater than 0", 400));
    }

    // Get supplier record for current user
    const supplier = await prisma.supplier.findUnique({
      where: { userId: currentUser.id },
    });

    if (!supplier) {
      return next(new AppError("Supplier record not found", 404));
    }

    // Create product and initial stock in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      const newProduct = await prisma.product.create({
        data: {
          name: name.trim(),
          description,
          price,
        },
      });

      await prisma.productStock.create({
        data: {
          productId: newProduct.id,
          supplierId: supplier.id,
          quantity: initialStock,
        },
      });

      return newProduct;
    });

    res.status(201).json({
      status: "success",
      message: "Product created successfully with initial stock",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// POST /products/:id/upload-image
export const uploadProductImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = res.locals.currentUser;

    if (!currentUser || currentUser.role !== "supplier") {
      return next(new AppError("Unauthorized: Supplier only", 401));
    }

    const productId = Number(req.params.id);

    const productStock = await prisma.productStock.findFirst({
      where: {
        productId,
        supplier: {
          userId: currentUser.id,
        },
      },
      include: {
        product: true,
      },
    });

    if (!productStock) {
      return next(
        new AppError("Unauthorized: You do not supply this product", 403)
      );
    }

    if (!req.file) {
      return next(new AppError("No image file uploaded", 400));
    }

    const imagePath = path.join("uploads", req.file.filename);

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { productImage: imagePath },
    });

    res.status(200).json({
      message: "Product image uploaded successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(new AppError("Error uploading product image", 500));
  }
};




