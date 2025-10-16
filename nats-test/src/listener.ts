import { randomBytes } from 'crypto';
import nats, { Message, Subscription } from 'node-nats-streaming';
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
  // Code refactored- start

  // const options = stan
  //   .subscriptionOptions()
  //   .setManualAckMode(true) //Manually acknowledge processed event
  //   .setDeliverAllAvailable() //Sends all events to a subscriber listening to a channel,  whenever the subscriber/sys comes online.
  //   .setDurableName(queueGroup); //creates a Drable subscription on the server with the Id/name passed here. NATS server creates a RECORD(Drable subscription) inside the channel being listened to, that will list all events with their processed/acknowledgement status. Always use with a queue-group in other to persist the RECORD(Drable subscription) whenever the listerner/subscriber goes down. The channel is usually same as the queueGroup name, but it can also be any other name/string;
  // const subscription = stan.subscribe('ticket:created', queueGroup, options);
  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData();
  //   console.log('Data:', data);
  //   msg.ack();
  // });

  // Code refactored- end

  new TicketCreatedListener(stan).listen();
});

// Windows does not natively support "SIGINT SIGTERM"
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
