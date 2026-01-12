import express from "express";
import blogRoutes from "./routes/blog-route";
import { globalErrorHandler } from "./utils/global-error-handler";
import {corsMiddleware} from "./middlewares/cors";
import {limiter} from "./middlewares/rate-limiter";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(corsMiddleware);
app.use(limiter);
app.use(express.json());

app.use("/uploads", express.static("src/uploads"));

// Routes
app.use("/api/v1", blogRoutes);

// Global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
