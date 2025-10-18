import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', signin())
    .send({ title: 'burna show', price: 40.5 });
};

it('can retrieve or fetch a list of all available tickets without any form of authentication', async () => {
  //   Create tickets first
  await createTicket();
  await createTicket();
  await createTicket();

  //   Main test
  const res = await request(app).get(`/api/tickets`).send().expect(200);

  expect(res.body.length).toEqual(3);
});
