import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const PORT = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not found/defined...');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI env var not found/defined...');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID env var not found/defined...');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID env var not found/defined...');
  }
  if (!process.env.NATS_URI) {
    throw new Error('NATS_URI env var not found/defined...');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URI
    );
    const client = natsWrapper.client;

    // For gracefull exit of the client-start
    client.on('close', () => {
      console.log('Nats connection closed');
      process.exit();
    });
    process.on('SIGINT', () => client.close());
    process.on('SIGTERM', () => client.close());
    // For gracefull exit of the client-end

    // Listeners --Start
    new OrderCreatedListener(client).listen();
    new OrderCancelledListener(client).listen();
    // Listeners --End

    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(error);
  }

  app.listen(PORT, () => console.log(`Listening on port ${PORT} -- 🐳🐳!!!`));
};

start();
