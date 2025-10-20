import { OrderCancelledEvent, Orderstatus } from '@b-tickets/common';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledListener } from '../order-cancelled-listener';

const preTestSetup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.createTicket({
    price: 40,
    title: 'Wizzy',
    userId: 'asfg',
    orderId,
  });
  await ticket.save();

  //   Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      price: ticket.price,
      id: ticket.id,
    },
  };
  //   Fake msg obj
  //   @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, ticket, data, msg, orderId };
};

it('updates the ticket, publishes an update event and acks the message', async () => {
  const { listener, ticket, data, msg } = await preTestSetup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).toEqual(undefined);
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
