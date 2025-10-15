import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();
const clientId = randomBytes(3).toString('hex');

const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  const queueGroup = 'orders-service-queue-Group';
  console.log(
    `Listener connected to NATS, ClientID: ${clientId}, Queue-Group: ${queueGroup}`
  );

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(stan).listen();
});

// Windows does not natively support "SIGINT SIGTERM"
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
