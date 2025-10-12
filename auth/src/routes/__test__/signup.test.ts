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

it('returns a 400 with an invalid email!', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 with an invalid password!', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'p',
    })
    .expect(400);
});

it('returns a 400 with empty email and password!', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: '',
      password: '',
    })
    .expect(400);
});

it('does not allow duplicate email!', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('a cookie is set on the headers after a successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
