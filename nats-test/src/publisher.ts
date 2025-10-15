import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
const clientId = 'abc';
const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log(`Publisher connected to NATS, ClientID: ${clientId}`);

  const data = {
    id: '123',
    title: 'concert4',
    price: 20,
  };

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish(data);
  } catch (error) {
    console.error(error);
  }
});
