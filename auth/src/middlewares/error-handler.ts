import { NextFunction, Request, Response } from 'express';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('⚠️Something went wrong!', err);
  //   errors: [
  //     {
  //       type: 'field',
  //       value: '12',
  //       msg: 'Password must be between 4 and 20 characters',
  //       path: 'password',
  //       location: 'body',
  //     },
  //   ];
  if (err instanceof RequestValidationError) {
    const formattedErrors = err.errors.map((error) => {
      if (error.type === 'field')
        return {
          message: error.msg,
          field: error.path,
        };
    });

    return res.status(400).send({ errors: formattedErrors });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(500).send({ errors: [{ message: err.reason }] });
  }

  res.status(400).send({ errors: [{ message: 'Something went wrong' }] });
};
