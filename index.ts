import app from './app';
import { connectDB } from './connectDB';

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
