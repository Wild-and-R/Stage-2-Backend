import express from "express";  
import productRoutes from './routes/product-route';

const app = express();
const PORT = 4000;

app.use(express.json());
app.use("/api/v1", productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});