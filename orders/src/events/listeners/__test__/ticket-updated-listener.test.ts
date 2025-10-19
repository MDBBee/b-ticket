import { TicketUpdatedEvent } from '@b-tickets/common';
import { natsWrapper } from '../../../nats-wrapper';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const preTestSetUp = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);
  //   Create the ticket to be updated
  const ticket = Ticket.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 40,
    title: 'Wizzy',
  });
  await ticket.save();
  //   Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    price: 500,
    title: 'New Wizzy',
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  //   Create a fake msg object
  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, ticket, data, msg };
};

it('it updates and saves a message after finding it', async () => {
  const { listener, ticket, data, msg } = await preTestSetUp();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.version).toEqual(data.version);
});

it('acknoledges"acks" the message after a successful processing', async () => {
  const { listener, data, msg } = await preTestSetUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not acknoledges"acks" the message if the incoming data version  doesn\'t match the expected version', async () => {
  const { listener, data, msg } = await preTestSetUp();
  data.version = 20;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
