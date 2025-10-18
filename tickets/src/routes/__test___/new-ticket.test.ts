import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler waiting for incoming post requests to /api/tickets', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).not.toEqual(404);
});

it('can only be accessed by signed-in users', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('does not return a 401 if user is signed-in.', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({});
  expect(res.status).not.toEqual(401);
});

it('returns an error on submitting an invalid title', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: '', price: 20 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ price: 20 })
    .expect(400);
});

it('returns an error on submitting an invalid price', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: 'burna show', price: -2 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: 'burna show' })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let numOftickets = (await Ticket.find({})).length;
  expect(numOftickets).toEqual(0);

  const title = 'burna show';
  const price = 40.5;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title, price })
    .expect(201);

  numOftickets = (await Ticket.find({})).length;
  expect(numOftickets).toEqual(1);
});

it('publishes an event after a successful ticket creation', async () => {
  let numOftickets = (await Ticket.find({})).length;
  expect(numOftickets).toEqual(0);

  const title = 'burna show';
  const price = 40.5;

  await request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title, price })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
