import request from 'supertest';
import { app } from '../../app';

it('responds with verified details of the current user', async () => {
  const cookie = await global.signin();

  if (!cookie) throw new Error('No cookie set after signup!');

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  //   console.log(response.body);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with "null", if not logged-in or signed-in', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  //   console.log(response.body);

  expect(response.body.currentUser).toEqual(null);
});
