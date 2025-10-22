import { OrderCreatedEvent, Orderstatus } from '@b-tickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { OrderCreatedListener } from '../order-created-listener';

const preTestSetUp = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'gbhjhjhb',
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: Orderstatus.Created,
    ticket: {
      id: 'hjhbhkh',
      price: 40,
    },
  };
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

it('creates and saves an order. Technically replicating the order into the payment db', async () => {
  const { listener, data, msg } = await preTestSetUp();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order?.price).toEqual(data.ticket.price);
});

it('acknowledges the msg', async () => {
  const { listener, data, msg } = await preTestSetUp();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
