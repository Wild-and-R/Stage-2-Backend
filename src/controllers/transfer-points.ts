import { Request, Response} from "express";
import { prisma } from "../connection/client";
import AppError from "../utils/app-error";

export const transferPoints = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const { amount, senderId, receiverId } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return next(new AppError("Transfer amount must be greater than 0", 400));
    }

    if (senderId === receiverId) {
      return next(new AppError("Sender and receiver cannot be the same", 400));
    }

    // Fetch users
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!sender) {
      return next(new AppError("Sender not found", 404));
    }

    if (!receiver) {
      return next(new AppError("Receiver not found", 404));
    }

    if (sender.points < amount) {
      return next(new AppError("Insufficient points", 400));
    }

    // Transaction: atomic operation
    await prisma.$transaction([
      prisma.user.update({
        where: { id: senderId },
        data: {
          points: {
            decrement: amount,
          },
        },
      }),
      prisma.user.update({
        where: { id: receiverId },
        data: {
          points: {
            increment: amount,
          },
        },
      }),
    ]);

    res.status(200).json({
      status: "success",
      message: "Points transferred successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: any
) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        points: true,
      },
    });

    res.status(200).json({
      status: "success",
      results: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};