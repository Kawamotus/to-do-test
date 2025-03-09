import { z } from 'zod';
import { IUser, User } from './user.model';
import { AppError } from '../../core/errors/appError';
import bcrypt from 'bcryptjs';
import { Request } from 'express';

const createUserValidation = z.object({
  name: z.string().min(5),
  email: z.string().email(),
  password: z.string().min(8),
});

const updateUserValidation = z.object({
  name: z.string().min(5).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
});

export class UserService {
  private saltRounds = 10;

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    const validation = createUserValidation.safeParse(data);
    if (!validation.success) {
      throw new AppError('invalid data', 400, validation.error.errors);
    }

    const { email, password, name } = data;
    const hashPassword = await this.hashPassword(password!);

    const newData = {
      email: email,
      password: hashPassword,
      name: name,
    };

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('email already exists', 409);
    }

    return await User.create(newData);
  }

  async getUsers(): Promise<IUser[]> {
    return await User.find().select('-password');
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id).select('-password');
    if (!user) throw new AppError('user not found', 404);

    return user;
  }

  async updateUser(id: string, data: Partial<IUser>, { user }: Request): Promise<IUser> {
    const validation = updateUserValidation.safeParse(data);
    if (!validation.success) {
      throw new AppError('invalid data', 400, validation.error.errors);
    }

    if (id !== user!.id) throw new AppError('access denied', 403);

    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }

    const userUpdated = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    ).select('-password');

    if (!userUpdated) throw new AppError('user not found', 404);

    return userUpdated;
  }

  async deleteUser(id: string, req: Request): Promise<void> {
    if (id !== req.user!.id) throw new AppError('access denied', 403);

    const result = await User.findByIdAndDelete(id);

    if (!result) throw new AppError('user not found', 404);
  }
}
