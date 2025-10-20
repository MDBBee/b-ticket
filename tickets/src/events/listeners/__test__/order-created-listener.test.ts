import { OrderCreatedEvent, Orderstatus } from '@b-tickets/common';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const preTestSetup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const ticket = Ticket.createTicket({
    price: 40,
    title: 'Wizzy',
    userId: 'asfg',
  });
  await ticket.save();

  //   Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: 'hgghggh',
    expiresAt: 'jhjhhjh',
    status: Orderstatus.Created,
    ticket: {
      price: ticket.price,
      id: ticket.id,
    },
  };
  //   Fake msg obj
  //   @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, ticket, data, msg };
};

it('Marks the ticket as reserved by setting the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await preTestSetup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket?.orderId).toEqual(data.id);
});

it('Acknowledges"acks" the message reception', async () => {
  const { listener, data, msg } = await preTestSetup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket update event to sync ticket version', async () => {
  const { listener, data, msg } = await preTestSetup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
