import express, { Request, Response } from 'express';
import { Order } from '../models/order';
import {
  NotAuthorizedError,
  NotFoundError,
  Orderstatus,
  requireAuth,
} from '@b-tickets/common';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();

    if (order.userId !== req.currentUser?.id) throw new NotAuthorizedError();
    order.status = Orderstatus.Cancelled;
    await order.save();

    // Publish an event for canceling/updating this order

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
