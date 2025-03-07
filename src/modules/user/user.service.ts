import { z } from 'zod';
import { IUser, User } from './user.model';
import { AppError } from '../../core/errors/appError';

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
  async createUser(data: Partial<IUser>): Promise<IUser> {
    const validation = createUserValidation.safeParse(data);
    if (!validation.success) {
      throw new AppError('Validation Error', 400, validation.error.errors);
    }

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('Email already exists', 409);
    }

    return await User.create(data);
  }

  async getUsers(): Promise<IUser[]> {
    return await User.find().select('-password');
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id).select('-password');
    if (!user) throw new AppError('user not found', 404);

    return user;
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser> {
    const validation = updateUserValidation.safeParse(data);

    if (!validation.success) {
      throw new AppError('invalid data', 400, validation.error.errors);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    ).select('-password');

    if (!user) throw new AppError('user not found', 404);

    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const result = await User.findByIdAndDelete(id);

    if (!result) throw new AppError('user not found', 404);
  }
}
