import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

const signinValidation = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('Password must be provided!'),
];

router.post(
  '/api/users/signin',
  signinValidation,
  validateRequest,
  (req: Request, res: Response) => {
    const { email, password } = req.body;

    res.send('Hi there-signin-user');
  }
);

export { router as signinRouter };
