import { Task, ITask } from './task.model';
import { AppError } from '../../core/errors/appError';
import { z } from 'zod';
import { Request } from 'express';

const createTaskValidation = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['pendente', 'em progresso', 'concluída']).optional(),
  user: z.string().min(1),
});

const updateTaskValidation = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['pendente', 'em progresso', 'concluída']).optional(),
});

export class TaskService {
  async createTask(data: Partial<ITask>): Promise<ITask> {
    const validation = createTaskValidation.safeParse(data);
    if (!validation.success) {
      throw new AppError('invalid data', 400, validation.error.errors);
    }

    return await Task.create(data);
  }

  async getAllTasks(): Promise<ITask[]> {
    return await Task.find();
  }

  async getTasksByUser(userId: string): Promise<ITask[]> {
    return await Task.find({ user: userId });
  }

  async getTaskById(id: string): Promise<ITask> {
    const task = await Task.findById(id);
    if (!task) throw new AppError('task not found', 404);
    return task;
  }

  async updateTask(id: string, data: Partial<ITask>, req: Request): Promise<ITask> {
    const validation = updateTaskValidation.safeParse(data);
    if (!validation.success) {
      throw new AppError('invalid data', 400, validation.error.errors);
    }

    const idTask = (await Task.findById(id)) as ITask;
    if (idTask.user.toString() !== req.user!.id) throw new AppError('access denied', 403);

    const task = await Task.findByIdAndUpdate(id, data, { runValidators: true });

    if (!task) throw new AppError('task not found', 404);
    return task;
  }

  async deleteTask(id: string, req: Request): Promise<void> {
    const task = await Task.findById(id);
    if (!task) {
      throw new AppError('task not found', 404);
    }

    const idTask = (await Task.findById(id)) as ITask;
    if (idTask.user.toString() !== req.user!.id) throw new AppError('access denied', 403);

    await Task.findByIdAndDelete(id);
  }
}
