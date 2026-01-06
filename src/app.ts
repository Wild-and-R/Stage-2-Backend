import express from "express";  
import blogRoutes from './routes/blog-route';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/v1", blogRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});