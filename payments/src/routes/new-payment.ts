import { requireAuth } from '@b-tickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

const router = express.Router();

const validateInputs = [
  body('token').not().isEmpty(),
  body('orderId').not().isEmpty(),
];

router.post(
  '/api/payments',
  requireAuth,
  validateInputs,
  async (req: Request, res: Response) => {
    res.send({ success: true });
  }
);

export { router as paymentsRouter };
