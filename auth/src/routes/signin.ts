import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@b-tickets/common';
import { User } from '../models/user';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

const signinValidation = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('Password must be provided!'),
];

router.post(
  '/api/users/signin',
  signinValidation,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      throw new BadRequestError('Invalid Log-in credential');
    }

    const isPasswordCorrect = await Password.compare(
      existingUser.password,
      password
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError('Invalid Log-in credential');
    }

    const userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY as string
    );
    req.session = { jwt: userJwt };

    res.status(200).send({ user: existingUser });
  }
);

export { router as signinRouter };
