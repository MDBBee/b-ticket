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

const router = express.Router();
const TICKET_RESERVE_EXPIRATION_TIME = 15 * 60;

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

    if (existingOrder)
      throw new BadRequestError('Ticket is unavailable at the moment');

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

    // Publish an order created event
    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
