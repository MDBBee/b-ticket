import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  Orderstatus,
  requireAuth,
  validateRequest,
} from '@b-tickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';

const router = express.Router();

const validateInputs = [
  body('token').not().isEmpty(),
  body('orderId').not().isEmpty(),
];

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

    res.send({ success: true });
  }
);

export { router as paymentsRouter };
