import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

import { User } from '../models/user';
import { BadRequestError } from '../errors/badrequestError';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

const signUpValidation = [
  body('email').isEmail().withMessage('Invalid email, please cross-check'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 and 20 characters'),
];

router.post(
  '/api/users/signup',
  signUpValidation,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('This Email is already in use!');
    }

    const user = User.buildUser({
      email: email.toLowerCase(),
      password,
    });
    await user.save();

    const userJwt = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY as string
    );
    req.session = { jwt: userJwt };

    res.status(201).send({ user });
  }
);

export { router as signupRouter };
