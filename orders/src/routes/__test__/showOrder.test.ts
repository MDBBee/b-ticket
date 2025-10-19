import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

it('fetches the order', async () => {
  // create a ticket
  const ticket = Ticket.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'show',
    price: 40,
  });
  await ticket.save();

  const user1 = global.signin();
  const user2 = global.signin();
  // create an order with the ticket
  const { body: createdOrder } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  // fetch the order by user that created the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${createdOrder.id}`)
    .set('Cookie', user1)
    .expect(200);
  expect(fetchedOrder.id).toEqual(createdOrder.id);
});

it('returns an error whenever a user tries to fetch an order it did not create', async () => {
  // create a ticket
  const ticket = Ticket.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'show',
    price: 40,
  });
  await ticket.save();

  const user1 = global.signin();
  const user2 = global.signin();
  // create an order with the ticket
  const { body: createdOrder } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  // fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${createdOrder.id}`)
    .set('Cookie', user2)
    .expect(401);
});
