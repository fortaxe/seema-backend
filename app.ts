// app.ts
import express from 'express';

import dotenv from 'dotenv';
import cors from 'cors';

import adminAuthRoutes from './routes/admin-auth';
import userRoutes from './routes/user';
import blogRoutes from './routes/blog';
import videoRoutes from './routes/video';
import categoryRoutes from './routes/category';
import r2Routes from './routes/r2';


dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://seema-sigma.vercel.app',
      'https://ai-f-inance.vercel.app'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes

app.use('/api', adminAuthRoutes);
app.use('/api', userRoutes);
app.use('/api', blogRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', r2Routes);

app.get("/", (req, res) => {
  res.json({ message: "Hello World from backend" });
});

export default app;
