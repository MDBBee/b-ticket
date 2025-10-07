import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

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
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    const { email, password } = req.body;
    console.log('Creating a user...');

    res.send('Hi there-signup-user');
  }
);

export { router as signupRouter };
