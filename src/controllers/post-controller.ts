import { Request, Response } from "express";
import {posts, Post} from "../models/post-model";

export const getPosts = (req: Request, res: Response) => {
    res.json(posts);
};

export const createPosts = (req: Request, res: Response) => {
    const {title, content} = req.body;
    const newPost: Post = {
        id: posts.length + 1,
        title,
        content
    };
    posts.push(newPost);
    res.status(201).json(newPost);
};

export const updatePost = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, content } = req.body;

    const post = posts.find(p => p.id === id);
    if (post === undefined) {
        return res.status(404).json({ message: "Post not found" });
    }
    post.title = title ?? post.title;
    post.content = content ?? post.content;

    res.json(post);
};

export const deletePost = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const index = posts.findIndex(p => p.id === id);
    const deletedPost = posts.splice(index, 1);
    res.json({ message: "Post deleted", post: deletedPost[0] });
};
