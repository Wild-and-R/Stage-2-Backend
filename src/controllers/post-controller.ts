import { Request, Response, NextFunction } from "express";
import { prisma } from "../connection/client";
import AppError from "../utils/app-error";

// GET all posts
export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = res.locals.currentUser;
    const isAdmin = currentUser?.role === "admin";

    const posts = await prisma.post.findMany({
      where: isAdmin ? {} : { isAdminOnly: false },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        comments: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
      orderBy: { id: "desc" },
    });

    res.status(200).json({ status: "success", results: posts.length, data: posts });
  } catch (error) {
    next(new AppError("Error fetching posts", 500));
  }
};

// GET single post
export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = res.locals.currentUser;
    const postId = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
        comments: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    if (!post) return next(new AppError("Post not found", 404));
    if (post.isAdminOnly && currentUser?.role !== "admin") {
      return next(new AppError("Forbidden: Admin-only post", 403));
    }

    res.status(200).json({ status: "success", data: post });
  } catch (error) {
    next(new AppError("Error fetching post", 500));
  }
};

// CREATE post
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = res.locals.currentUser;
    if (!currentUser) return next(new AppError("Unauthorized", 401));

    const { title, content, isAdminOnly } = req.body;

    const post = await prisma.post.create({
      data: { title, content, userId: currentUser.id, isAdminOnly: isAdminOnly || false },
    });

    res.status(201).json({ status: "success", data: post });
  } catch (error) {
    next(new AppError("Error creating post", 500));
  }
};

// UPDATE post
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = Number(req.params.id);
    const currentUser = res.locals.currentUser;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) return next(new AppError("Post not found", 404));

    if (post.userId !== currentUser?.id && currentUser?.role !== "admin") {
      return next(new AppError("Forbidden", 403));
    }

    const { title, content, isAdminOnly } = req.body;
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { title, content, isAdminOnly },
    });

    res.status(200).json({ status: "success", data: updatedPost });
  } catch (error) {
    next(new AppError("Error updating post", 500));
  }
};

// DELETE post
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = Number(req.params.id);
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) return next(new AppError("Post not found", 404));

    await prisma.post.delete({ where: { id: postId } });

    res.status(200).json({ status: "success", message: "Post deleted successfully" });
  } catch (error) {
    next(new AppError("Error deleting post", 500));
  }
};
