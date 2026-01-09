import { Request, Response, NextFunction } from "express";
import AppError from "../utils/app-error";

export function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
  const currentUser = res.locals.currentUser;

  if (!currentUser) {
    return next(new AppError("Unauthorized", 401));
  }

  if (currentUser.role !== "admin") {
    return next(new AppError("Forbidden: Admin access only", 403));
  }

  next();
}
