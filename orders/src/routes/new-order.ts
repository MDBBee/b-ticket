import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  Orderstatus,
  requireAuth,
  validateRequest,
} from '@b-tickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const TICKET_RESERVE_EXPIRATION_TIME = 30;

const validationBody = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('A valid ticketId must be provided!'),
];

router.post(
  '/api/orders',
  requireAuth,
  validationBody,
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError();

    // Ticket reserved?:>query orders where ticketId=ticket.id&&>order.staus!=="cancelled">
    const existingOrder = await ticket.isReserved();

    if (existingOrder) throw new BadRequestError('Ticket has been reserved.');

    // Calc order-expiration date
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + TICKET_RESERVE_EXPIRATION_TIME
    );

    // Create order and save to db
    const order = Order.createOrder({
      userId: req.currentUser?.id as string,
      status: Orderstatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();

    // Publish an order created event
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      userId: order.userId,
      version: order.version,
      ticket: { id: ticket.id, price: ticket.price },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
