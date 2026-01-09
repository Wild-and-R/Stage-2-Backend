import express from 'express'
import { getProducts, getProduct, updateProduct, deleteProduct } from "../controllers/product-controller";
import { getOrderSummary } from "../controllers/order-controller";
import { transferPoints, getUsers } from '../controllers/transfer-points';
import { updateSupplierStock } from "../controllers/supplier-stock";
import { supplierLogin, getSupplierProducts, addProduct } from '../controllers/supplier-controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.put("/products/:id", authenticate, updateProduct);
router.delete("/products/:id", authenticate, deleteProduct);
router.get("/orders/summary", getOrderSummary);
router.post("/transfer-points", transferPoints);
router.get("/users", getUsers);
router.post("/suppliers/stock", updateSupplierStock);
router.post("/suppliers/login", supplierLogin);
router.get("/suppliers/products", authenticate, getSupplierProducts);
router.post("/products/add", authenticate, addProduct);


export default router;