import express from "express";  
import cartRoutes from './routes/cart-route';

const app = express();
const PORT = 4000;

app.use(express.json());
app.use("/api/v1", cartRoutes);
app.use((err: any, req: any, res: any, next: any) => {
    console.log(err);
    res.status(err.status || 500).json({error: err.message || 'Internal Server Error'});
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});