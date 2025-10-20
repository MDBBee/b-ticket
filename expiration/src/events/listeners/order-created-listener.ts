import { Listener, OrderCreatedEvent, Subjects } from '@b-tickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log(
      'waiting for ->',
      delay / 1000,
      'seconds! before processing the job'
    );

    await expirationQueue.add({ orderId: data.id }, { delay });

    msg.ack();
  }
}
