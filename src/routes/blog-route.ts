import express from "express";
import {getPosts, getPost, createPost, updatePost, deletePost} from "../controllers/post-controller";
import {getUsers, getUser, updateUser, deleteUser} from "../controllers/user-controller";
import {getPostComments, getCommentsSummary} from "../controllers/comment-controller";
import { registerUser, loginUser } from "../controllers/auth";
import { authenticate } from "../middlewares/auth";
import { authorizeAdmin } from "../middlewares/authorize-admin";

const router = express.Router();

//Posts Routes
// Public: view all posts or single post
router.get("/posts", getPosts);
router.get("/posts/:id", getPost);

// Authenticated: create/update posts
router.post("/posts", authenticate, createPost);
router.put("/posts/:id", authenticate, updatePost);

// Admin-only: delete post
router.delete("/posts/:id", authenticate, authorizeAdmin, deletePost);

// Comments Routes

// Public: view comments
router.get("/posts/:id/comments", getPostComments);
router.get("/comments", getCommentsSummary);

// Users Routes

// Public: viewing users
router.get("/users", getUsers);
router.get("/users/:id", getUser);

// Admin-only: update or delete users
router.put("/users/:id", authenticate, authorizeAdmin, updateUser);
router.delete("/users/:id", authenticate, authorizeAdmin, deleteUser);

// Auth Routes

router.post("/register", registerUser); // public
router.post("/login", loginUser);       // public

export default router;
