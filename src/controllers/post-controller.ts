import { Request, Response } from "express";
import { prisma } from "../connection/client";

// GET all posts
export const getPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: { user: true },
    });

    res.json({
      message: "List of all posts",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// GET post by ID
export const getPost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

// CREATE post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, userId } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId,
      },
    });

    res.status(201).json({
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

// UPDATE post
export const updatePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    const post = await prisma.post.update({
      where: { id },
      data: { title, content },
    });

    res.json({
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    res.status(404).json({ message: "Post not found", error });
  }
};

// DELETE post
export const deletePost = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const post = await prisma.post.delete({
      where: { id },
    });

    res.json({
      message: "Post deleted successfully",
      data: post,
    });
  } catch (error) {
    res.status(404).json({ message: "Post not found", error });
  }
};
