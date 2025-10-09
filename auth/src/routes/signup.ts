import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { User } from '../models/user';
import { BadRequestError } from '../errors/badrequestError';
import { Password } from '../utils/password';
import jwt from 'jsonwebtoken';

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
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('This Email is already in use!');
    }

    // Hash Password

    const user = User.buildUser({ email, password });
    await user.save();

    const userJwt = jwt.sign({ id: user.id, email: user.email }, 'abc');
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
