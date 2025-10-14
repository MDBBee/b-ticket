import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: 'burna show', price: 40.5 });
};

it('returns a 404 if the ticket does not exist or ticketId is invalid', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({ title: 'burna show', price: 40.5 })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'burna show', price: 40.5 })
    .expect(401);
});

it('returns a 401 if the user is not the owner of the ticket', async () => {
  const ticket = await createTicket();
  const ticketId = ticket.body.id;
  const ticketOwner = ticket.body.userId;

  const updateTicketResponse = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', signin())
    .send({ title: 'Wizzy show', price: 100 })
    .expect(401);

  //   expect(updateTicketResponse.body.title).toEqual('Wizzy show');
});

it('returns a 400 if the user inputs are invalid ', async () => {
  const cookie = signin();

  const ticket = await createTicket();
  const ticketId = ticket.body.id;

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', signin())
    .send({ title: '', price: 100 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', signin())
    .send({ title: 'Davido', price: -10 })
    .expect(400);
});

it('updates the ticket should all requirements be met', async () => {
  const cookie = signin();

  const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'burna show', price: 40.5 });
  const ticketId = ticket.body.id;

  const updateTicketResponse = await request(app)
    .put(`/api/tickets/${ticketId}`)
    .set('Cookie', cookie)
    .send({ title: 'Wizzy Lokay', price: 100 })
    .expect(200);

  expect(updateTicketResponse.body.title).toEqual('Wizzy Lokay');
});
