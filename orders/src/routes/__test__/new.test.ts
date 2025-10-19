import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { Orderstatus } from '@b-tickets/common';

it('returns an error for non existent tickets', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: new mongoose.Types.ObjectId() })
    .expect(404);
});

it('returns an error for reserved tickets', async () => {
  const ticket = Ticket.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'bronx',
    price: 200,
  });
  await ticket.save();
  //   const reservedTicketId = ticket.id;

  const order = Order.createOrder({
    ticket,
    userId: 'mlovjljfd',
    status: Orderstatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('returns 201 for after successfully reserving a ticket', async () => {
  const ticket = Ticket.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'bronx',
    price: 200,
  });
  await ticket.save();

  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', signin())
    .send({ ticketId: ticket.id })
    .expect(201);

  //   console.log('RES.FROM.NEWORDER', res.body);
});

it('publishes an order:created event', async () => {
  const ticket = Ticket.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'bronx',
    price: 200,
  });
  await ticket.save();

  const user = signin();
  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
