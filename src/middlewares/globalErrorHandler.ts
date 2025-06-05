import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { v4 as uuidv4 } from 'uuid';
import logger from '../config/logger';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || err.status || 500;
  const errorId = uuidv4();
  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction ? 'Internal Server Error' : err.message;
  logger.error(err.message, {
    id: errorId,
    statusCode,
    stack: err.stack,
    path: path.basename(req.path),
    method: req.method,
    url: req.originalUrl,
  });
  res.status(statusCode).json({
    errors: [
      {
        ref: errorId,
        type: err.name,
        msg: message,
        path: req.path,
        method: req.method,
        location: 'server',
        stack: isProduction ? undefined : err.stack, // Only include stack trace in non-production environments
      },
    ],
  });
};
export default globalErrorHandler;
