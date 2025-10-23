import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  Orderstatus,
  Publisher,
  requireAuth,
  validateRequest,
} from '@b-tickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const validateInputs = [
  body('token').not().isEmpty(),
  body('orderId').not().isEmpty(),
];

// stripe token for testing charges
// const token = "tok_visa"

router.post(
  '/api/payments',
  requireAuth,
  validateInputs,
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser?.id) throw new NotAuthorizedError();
    if (order.status === Orderstatus.Cancelled)
      throw new BadRequestError('Order has been cancelled');

    const charge = await stripe.charges.create({
      currency: 'eur',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.createPayment({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ success: true, payment });
  }
);

export { router as paymentsRouter };
