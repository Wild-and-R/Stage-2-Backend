import express from 'express'
import { getProducts, createProducts, updateProduct, deleteProduct } from "../controllers/post-controller";

const router = express.Router();

router.get('/products', getProducts);
router.post('/products', createProducts);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
