import express from "express";
import blogRoutes from "./routes/blog-route";
import { globalErrorHandler } from "./utils/global-error-handler";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Routes
app.use("/api/v1", blogRoutes);

// Global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
