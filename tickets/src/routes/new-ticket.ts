import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@b-tickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const createTicketBodyValidation = [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
];

router.post(
  '/api/tickets',
  requireAuth,
  createTicketBodyValidation,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    console.log('PRICE', price);

    const ticket = Ticket.createTicket({
      title,
      price,
      userId: req.currentUser?.id as string,
    });
    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
