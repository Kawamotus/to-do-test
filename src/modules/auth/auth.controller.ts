import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AppError } from '../../core/errors/appError';

export class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw new AppError('email and password are required', 400);
      const token = await this.authService.login(email, password);
      res.json({ token });
    } catch (e) {
      next(e);
    }
  }
}
