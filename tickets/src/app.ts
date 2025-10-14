import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@b-tickets/common';

import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/showTicket';
import { allTickestRouter } from './routes/allTickets';
import { updateTicketRouter } from './routes/updateTickets';

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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(allTickestRouter);
app.use(updateTicketRouter);

app.all('*', async (req: Request, res: Response) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
