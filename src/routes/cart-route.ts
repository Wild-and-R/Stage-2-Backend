import express from 'express'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product-controller";
import { getOrderSummary } from "../controllers/order-controller";

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.post('/products', createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/orders/summary", getOrderSummary);

export default router;