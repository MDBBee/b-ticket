import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const createTicket = async (input: string) => {
  const ticket = Ticket.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: input,
    price: 30,
  });
  await ticket.save();

  return ticket;
};

it('returns a list of orders for a particular user', async () => {
  // Create four tickets
  const ticket1 = await createTicket('ticket1');
  const ticket2 = await createTicket('ticket2');
  const ticket3 = await createTicket('ticket3');
  const ticket4 = await createTicket('ticket4');

  const user1 = global.signin();
  const user2 = global.signin();
  // Create 1 order as user1
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // Create 3 orders as user2
  await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);
  await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);
  await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket4.id })
    .expect(201);

  // Fetch orders for user2
  const res2 = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  // Fetch orders for user1
  const res1 = await request(app)
    .get('/api/orders')
    .set('Cookie', user1)
    .expect(200);

  expect(res2.body.length).toEqual(3);
  expect(res1.body.length).toEqual(1);

  //   console.log('User2:', res2.body, 'USER1', res1.body, ticket4);
});
