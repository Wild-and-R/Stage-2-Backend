import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../connection/client";
import { signToken } from "../utils/jwt";
import AppError from "../utils/app-error";

// Register
export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password } = req.body;

    // Check for missing fields
    if (!name || !email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    // Email format validation
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      //^ start string a-zA-Z0-9._%+- allows letters, digits, dot (.), underscore (_), percent (%), plus (+), minus (-)
    if (!emailRegex.test(email)) {
      return next(new AppError("Invalid email format", 400));
    }

    // Password length validation
    if (password.length < 5) {
      return next(
        new AppError("Password must be at least 5 characters long", 400)
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(new AppError("Email already exists", 409));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    });

    // Sign JWT
    const token = signToken({ id: user.id, role: user.role });

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}


// Login User
export async function loginUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(new AppError("Email and password are required", 400));

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return next(new AppError("Invalid credentials", 401));

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return next(new AppError("Invalid credentials", 401));

    const token = signToken({ id: user.id, role: user.role });

    res.status(200).json({
      status: "success",
      token,
      data: { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (error) {
    next(error);
  }
}
