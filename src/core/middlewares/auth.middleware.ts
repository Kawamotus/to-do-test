import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/appError';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
    };
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('Acesso não autorizado. Faça login.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as { userId: string };
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    next(new AppError('Token inválido ou expirado', 401));
  }
};
