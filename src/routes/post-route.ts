import express from 'express'
import { getPosts, createPosts } from "../controllers/post-controller";

const router = express.Router();

router.get('/posts', getPosts);
router.post('/posts', createPosts);

export default router;