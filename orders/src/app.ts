import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@b-tickets/common';

import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/showOrder';
import { allOrdersRouter } from './routes/allOrders';
import { deleteOrderRouter } from './routes/deleteOrder';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(allOrdersRouter);
app.use(deleteOrderRouter);

app.all('*', async (req: Request, res: Response) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
