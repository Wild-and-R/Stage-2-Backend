import { Request, Response } from "express";
import { prisma } from "../connection/client";

// GET /posts/:id/comments?page=&limit=
export const getPostComments = async (req: Request, res: Response) => {
  try {
    const postId = Number(req.params.id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [total, comments] = await Promise.all([
      prisma.comment.count({ where: { postId } }),
      prisma.comment.findMany({
        where: { postId },
        include: { user: true },
        skip,
        take: limit,
        orderBy: { id: "asc" },
      }),
    ]);

    res.status(200).json({
      message: `Comments for post ${postId}`,
      data: comments,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

// GET /comments?page=1&limit=10&minComments=0
export const getCommentsSummary = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const minCommentsQuery = req.query.minComments;
    let minComments: number | undefined;

    if (minCommentsQuery !== undefined) {
      minComments = Number(minCommentsQuery);
      if (isNaN(minComments)) {
        return res.status(400).json({ message: "Invalid minComments query parameter" });
      }
    }

    // Fetch all posts with comment count and user info
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { comments: true } },
      },
      orderBy: [{ comments: { _count: "desc" } }], // sort by comment count
    });

    // Filter by minimum comments if provided
    const filteredPosts = minComments !== undefined
      ? posts.filter(post => post._count.comments >= minComments!)
      : posts;

    // Apply pagination
    const paginatedPosts = filteredPosts.slice(skip, skip + limit);

    // Format response
    const formatted = paginatedPosts.map(post => ({
      postId: post.id,
      postTitle: post.title,
      user: post.user,
      commentsCount: post._count.comments,
    }));

    res.status(200).json({
      message: "Comments summary fetched successfully",
      data: formatted,
      pagination: {
        total: filteredPosts.length,
        page,
        limit,
        pages: Math.ceil(filteredPosts.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching comments summary:", error);
    res.status(500).json({
      message: "Error fetching comments summary",
      error: error instanceof Error ? error.message : error,
    });
  }
};
