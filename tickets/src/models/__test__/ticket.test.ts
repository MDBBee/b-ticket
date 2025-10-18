import { Ticket } from '../ticket';

it('validates optimistic concurrency control', async () => {
  // Create a ticket
  const ticket = Ticket.createTicket({
    title: 'Wizzy',
    price: 40,
    userId: '123',
  });
  await ticket.save();

  // Fetch ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two changes to the tickets, one each
  firstInstance?.set({ price: 20 });
  secondInstance?.set({ price: 30 });

  // Save the firstInst
  await firstInstance?.save();

  // Save the secondtInst and expect an error
  try {
    await secondInstance?.save();
  } catch (error) {
    return;
  }

  throw new Error('Test failed if this point is reached');
});

it('updates version number by increments on multiple saves', async () => {
  // Create a ticket
  const ticket = Ticket.createTicket({
    title: 'Wizzy',
    price: 40,
    userId: '123',
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket?.save();
  expect(ticket.version).toEqual(1);

  await ticket?.save();
  expect(ticket.version).toEqual(2);
});
