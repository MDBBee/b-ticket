import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@b-tickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();
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
    res.send({});
  }
);

export { router as createOrderRouter };
