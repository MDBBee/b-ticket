import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const PORT = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not found/defined...');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI env var not found/defined...');
  }

  try {
    await natsWrapper.connect(
      'ticketing',
      'yueghehg6767',
      'http://nats-srv:4222'
    );
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(error);
  }

  app.listen(PORT, () => console.log(`Listening on port ${PORT} -- 🐳🐳!!!`));
};

start();
