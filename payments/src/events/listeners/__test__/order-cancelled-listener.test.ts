import { Orderstatus, OrderCancelledEvent } from '@b-tickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { OrderCancelledListener } from '../order-cancelled-listener';

const preTestSetUp = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.createOrder({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: Orderstatus.Created,
    price: 40,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'hjhbhkh',
      price: 40,
    },
  };
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, order, msg };
};

it('updates the status of the order', async () => {
  const { listener, data, msg, order } = await preTestSetUp();
  await listener.onMessage(data, msg);

  const cancelledOrder = await Order.findById(order.id);

  expect(cancelledOrder?.status).toEqual(Orderstatus.Cancelled);
});

it('acknowledges the msg', async () => {
  const { listener, data, msg } = await preTestSetUp();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
