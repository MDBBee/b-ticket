import request from 'supertest';
import { app } from '../../app';

it('a 201 return on successful signup!', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});
