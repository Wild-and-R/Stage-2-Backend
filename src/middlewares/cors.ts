import cors from 'cors';

export const corsMiddleware = cors({
    origin: 'http://localhost:50061',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
})
