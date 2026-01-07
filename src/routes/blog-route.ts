import express from 'express'
import {getPosts, getPost, createPost, updatePost, deletePost } from "../controllers/post-controller";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/user-controller";
import { getPostComments, getCommentsSummary } from "../controllers/comment-controller";

const router = express.Router();

router.get('/posts', getPosts);
router.get('/posts/:id', getPost);
router.post('/posts', createPost);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

router.get("/posts/:id/comments", getPostComments); // paginated
router.get("/comments", getCommentsSummary); 

router.post("/users", createUser);
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
export default router;