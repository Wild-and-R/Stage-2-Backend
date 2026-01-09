import express from "express";  
import cartRoutes from './routes/cart-route';
import { globalErrorHandler } from "./utils/global-error-handler";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 4000;

app.use(express.json());
app.use("/api/v1", cartRoutes);

// Global error handler
app.use(globalErrorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});