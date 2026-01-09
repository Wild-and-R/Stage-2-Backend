import { Request, Response, NextFunction } from "express";
import { prisma } from "../connection/client";
import AppError from "../utils/app-error";

// GET all users
export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({ include: { posts: true } });
    res.json({ message: "List of all users", data: users });
  } catch (error) {
    next(new AppError("Error fetching users", 500));
  }
};

// GET user by ID
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id }, include: { posts: true } });

    if (!user) return next(new AppError("User not found", 404));
    res.json({ message: "User fetched successfully", data: user });
  } catch (error) {
    next(new AppError("Error fetching user", 500));
  }
};

// UPDATE user (Admin only)
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { name, email, role } = req.body; // updated

    const user = await prisma.user.update({ where: { id }, data: { name, email, role } }); // updated
    res.json({ message: "User updated successfully", data: user });
  } catch (error) {
    next(new AppError("User not found", 404));
  }
};

// DELETE user (Admin only)
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted successfully", data: user });
  } catch (error) {
    next(new AppError("User not found", 404));
  }
};
