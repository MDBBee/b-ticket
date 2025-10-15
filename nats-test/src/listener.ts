import { randomBytes } from 'crypto';
import nats, { Message } from 'node-nats-streaming';

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

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('acc-serv');
  const subscription = stan.subscribe('ticket:created', queueGroup, options);

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});

// Windows does not natively support "SIGINT SIGTERM"
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
