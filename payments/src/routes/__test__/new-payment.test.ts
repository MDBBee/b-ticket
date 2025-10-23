import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { Orderstatus } from '@b-tickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');
// stripe token for testing charges
const testTokenStripe = 'tok_visa';

it('responds with a "not-found" error on purchasing/paying for an inexistent order', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'jkdjskdj',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('responds with a "not-authorized" error on purchasing/paying for an order not created by the user', async () => {
  const order = Order.createOrder({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 40,
    status: Orderstatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'jkdjskdj',
      orderId: order.id,
    })
    .expect(401);
});

it('responds with a "bad-request" error on purchasing/paying for a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.createOrder({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 40,
    status: Orderstatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'jkdjskdj',
      orderId: order.id,
    })
    .expect(400);
});

it('responds with a "204" when valid inputs are submitted', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.createOrder({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 10,
    status: Orderstatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order?.id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual(testTokenStripe);
  expect(chargeOptions.amount).toEqual(10 * 100);
  expect(chargeOptions.currency).toEqual('eur');
});

it('responds with order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.createOrder({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 15,
    status: Orderstatus.Created,
  });
  await order.save();

  const res = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: testTokenStripe,
      orderId: order.id,
    })
    .expect(201);

  console.log('RES', res.body);

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: res.body.payment.stripeId,
  });

  expect(payment).not.toBeNull();
});
