import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super('Request parameters are invalid');
    // Only because we are extending a class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  // console.log('⚠️Something went wrong!', err);
  //   errors: [
  //     {
  //       type: 'field',
  //       value: '12',
  //       msg: 'Password must be between 4 and 20 characters',
  //       path: 'password',
  //       location: 'body',
  //     },
  //   ];

  serializeErrors() {
    return this.errors.map((error) => {
      if (error.type === 'field')
        return {
          message: error.msg,
          field: error?.path as string,
        };
      return {
        message: error.msg,
      };
    });
  }
}
