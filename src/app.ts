import express from "express";  
import cartRoutes from './routes/cart-route';

const app = express();
const PORT = 4000;

app.use(express.json());
app.use("/api/v1", cartRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});