// app.ts
import express from 'express';

import dotenv from 'dotenv';
import cors from 'cors';

import adminAuthRoutes from './routes/admin-auth.ts';
import userRoutes from './routes/user.ts';
import blogRoutes from './routes/blog.ts';
import videoRoutes from './routes/video.ts';
import r2Routes from './routes/r2.ts';


dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://seema-sigma.vercel.app'
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
app.use('/api', videoRoutes);
app.use('/api', r2Routes);

app.get("/", (req, res) => {
  res.json({ message: "Hello World from backend" });
});

export default app;
