import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import logger from './config/logger';
import cookieParser from 'cookie-parser';
import { HttpError } from 'http-errors';
import authRouter from './routes/auth';
import tenantRouter from './routes/tenant';
import userRouter from './routes/user';
const app = express();
app.use(express.static('public'));
app.use(cookieParser());
app.get('/', async (req, res) => {
  res.status(201).send('Welcome to auth application');
});
app.use(express.json());

app.use('/auth', authRouter);
app.use('/tenants', tenantRouter);
app.use('/users', userRouter);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        path: '',
        location: '',
      },
    ],
  });

  next();
});
export default app;
