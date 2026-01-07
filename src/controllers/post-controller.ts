import { Request, Response } from "express";
import { prisma } from "../connection/client";

// GET /posts?userId=
export const getPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : undefined;

    const posts = await prisma.post.findMany({
      where: userId ? { userId } : {},
      include: { user: true, comments: { include: { user: true } } },
      orderBy: { id: "asc" },
    });

    res.json({ message: "Posts fetched successfully", data: posts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// GET /posts/:id
export const getPost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: { id },
      include: { user: true, comments: { include: { user: true } } },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ message: "Post fetched successfully", data: post });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

// POST /posts
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, userId } = req.body;

    const post = await prisma.post.create({ data: { title, content, userId } });

    res.status(201).json({ message: "Post created successfully", data: post });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

// PUT /posts/:id
export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    const post = await prisma.post.update({ where: { id }, data: { title, content } });

    res.json({ message: "Post updated successfully", data: post });
  } catch (error) {
    res.status(404).json({ message: "Post not found", error });
  }
};

// DELETE /posts/:id
export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const post = await prisma.post.delete({ where: { id } });

    res.json({ message: "Post deleted successfully", data: post });
  } catch (error) {
    res.status(404).json({ message: "Post not found", error });
  }
};
