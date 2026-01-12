import { Request, Response, NextFunction } from "express";
import { prisma } from "../connection/client";
import AppError from "../utils/app-error";
import path from "path";

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

// UPDATE user (Same User or Admin only)
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

//upload profile picture
export const uploadProfilePicture = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.id);
    const currentUser = res.locals.currentUser;

    if (!req.file) {
      return next(new AppError("No file uploaded", 400));
    }

    // restrict to same user or admin
    if (currentUser.id !== userId && currentUser.role !== "ADMIN") {
    return next(new AppError("Unauthorized", 403));
    }

    const imagePath = path.join("uploads", req.file.filename);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        profileImage: imagePath,
      },
    });

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      data: user,
    });
  } catch (error) {
    next(new AppError("Error uploading profile picture", 500));
  }
};