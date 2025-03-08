import { NextFunction, Response, Request } from 'express';
import { AppError } from '../errors/appError';
import { ZodError } from 'zod';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });

    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation Error',
      details: err.errors,
    });

    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
