import { Request, Response } from "express";
import { prisma } from "../connection/client";

// GET all users
export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { posts: true },
    });

    res.json({
      message: "List of all users",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// GET user by ID
export const getUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      include: { posts: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// CREATE user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.create({
      data: { name, email },
    });

    res.status(201).json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// UPDATE user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    res.json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(404).json({ message: "User not found", error });
  }
};

// DELETE user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.delete({
      where: { id },
    });

    res.json({
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    res.status(404).json({ message: "User not found", error });
  }
};
