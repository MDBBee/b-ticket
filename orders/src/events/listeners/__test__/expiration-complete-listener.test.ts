import {
  ExpirationCompleteEvent,
  Orderstatus,
  TicketCreatedEvent,
} from '@b-tickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';
ExpirationCompleteListener;

const preTestSetUp = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 40,
    title: 'Wizzy',
  });
  await ticket.save();

  const order = Order.createOrder({
    status: Orderstatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, order, ticket, data, msg };
};

it('updates the order status to OrderStatus.Cancel', async () => {
  const { listener, order, data, msg } = await preTestSetUp();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder?.status).toEqual(Orderstatus.Cancelled);
});

it('publishes  an order cancelled event', async () => {
  const { listener, data, msg } = await preTestSetUp();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('it acknowledges the message', async () => {
  const { listener, data, msg } = await preTestSetUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
