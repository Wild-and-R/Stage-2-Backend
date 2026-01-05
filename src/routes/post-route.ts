import express from 'express'
import { getPosts, createPosts, updatePost, deletePost } from "../controllers/post-controller";

const router = express.Router();

router.get('/posts', getPosts);
router.post('/posts', createPosts);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);

export default router;
