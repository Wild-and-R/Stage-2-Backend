import express from 'express'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product-controller";
import { getOrderSummary } from "../controllers/order-controller";
import { transferPoints, getUsers } from '../controllers/transfer-points';
import { updateSupplierStock } from "../controllers/supplier-stock";

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.post('/products', createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/orders/summary", getOrderSummary);
router.post("/transfer-points", transferPoints);
router.get("/users", getUsers);
router.post("/suppliers/stock", updateSupplierStock);

export default router;