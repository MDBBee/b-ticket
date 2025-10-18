import { TicketCreatedEvent } from '@b-tickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListerner } from '../ticket-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const preTestSetUp = async () => {
  const listener = new TicketCreatedListerner(natsWrapper.client);
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 40,
    title: 'Wizzy',
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // @ts-ignore
  const msg: Message = { ack: jest.fn };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await preTestSetUp();
  await listener.onMessage(data, msg);
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it("acknowledges'acks' the message after a successful processing", async () => {
  const { listener, data, msg } = await preTestSetUp();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
