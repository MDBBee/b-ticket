import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('deletes/cancels an order by updating the order-status', async () => {
  // create a ticket
  const ticket = Ticket.createTicket({
    title: 'show',
    price: 40,
  });
  await ticket.save();

  const user = global.signin();
  // create an order with the ticket
  const { body: createdOrder } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // cancel/delete/update the order
  const { body: deletedOrder } = await request(app)
    .delete(`/api/orders/${createdOrder.id}`)
    .set('Cookie', user)
    .expect(204);

  // console.log('CreatedORDER', createdOrder);

  //   expect(deletedOrder.status).toEqual('cancelled');
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${createdOrder.id}`)
    .set('Cookie', user)
    .expect(200);

  expect(fetchedOrder.status).toEqual('cancelled');
});

it('publishes a cancelled event', async () => {
  // create a ticket
  const ticket = Ticket.createTicket({
    title: 'show',
    price: 40,
  });
  await ticket.save();

  const user = global.signin();
  // create an order with the ticket
  const { body: createdOrder } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // cancel/delete/update the order
  await request(app)
    .delete(`/api/orders/${createdOrder.id}`)
    .set('Cookie', user)
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
