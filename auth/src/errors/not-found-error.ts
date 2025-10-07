import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode: number = 404;

  constructor() {
    super('Invalid route');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): { message: string; field?: string }[] {
    return [{ message: 'Not Found' }];
  }
}
