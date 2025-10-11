import mongoose from 'mongoose';
import { app } from './app';

const PORT = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not found/defined...');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
  } catch (error) {
    console.error(error);
  }

  app.listen(PORT, () => console.log(`Listening on port ${PORT} -- 🐳🐳!!!`));
};

start();
