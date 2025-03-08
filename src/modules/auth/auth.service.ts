import jwt from 'jsonwebtoken';
import { User } from '../user/user.model';
import { AppError } from '../../core/errors/appError';
import bcrypt from 'bcryptjs';

export class AuthService {
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    return this.generateToken(user.id);
  }

  private generateToken(userId: string): string {
    if (!process.env.SECRET_KEY) {
      throw new Error('SECRET_KEY não está definido nas variáveis de ambiente');
    }

    return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '7d' });
  }
}
