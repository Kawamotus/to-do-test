import { Request, Response, NextFunction } from 'express';
import { TaskService } from './task.service';

export class TaskController {
  private taskService: TaskService;
  constructor() {
    this.taskService = new TaskService();
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const taskData = {
        ...req.body,
        user: req.user?.id,
      };

      const task = await this.taskService.createTask(taskData);

      res.status(201).json(task);
    } catch (e) {
      next(e);
    }
  }

  async getAllTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.status(200).json(tasks);
    } catch (e) {
      next(e);
    }
  }

  async getTasksByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const tasks = await this.taskService.getTasksByUser(req.user!.id);
      res.status(200).json(tasks);
    } catch (e) {
      next(e);
    }
  }

  async getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await this.taskService.getTaskById(req.params.id);
      res.status(200).json(task);
    } catch (e) {
      next(e);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      await this.taskService.updateTask(req.params.id, req.body, req);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      await this.taskService.deleteTask(req.params.id, req);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
