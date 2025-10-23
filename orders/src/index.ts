import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListerner } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

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

    // For gracefull exit of the client. --Start
    const client = natsWrapper.client;
    client.on('close', () => {
      console.log('Nats connection closed');
      process.exit();
    });
    process.on('SIGINT', () => client.close());
    process.on('SIGTERM', () => client.close());
    // For gracefull exit of the client. --End

    // Listeners --Start
    new TicketCreatedListerner(client).listen();
    new TicketUpdatedListener(client).listen();
    new ExpirationCompleteListener(client).listen();
    new PaymentCreatedListener(client).listen();
    // Listeners --End

    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error(error);
  }

  app.listen(PORT, () => console.log(`Listening on port ${PORT} -- 🐳🐳!!!`));
};

start();
