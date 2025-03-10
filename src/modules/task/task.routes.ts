import { Router } from 'express';
import { TaskController } from './task.controller';
import { authenticate } from '../../core/middlewares/auth.middleware';

const router = Router();
const controller = new TaskController();

router.post('/tasks/new', authenticate, controller.createTask.bind(controller));
router.get('/tasks/all', authenticate, controller.getAllTasks.bind(controller));
router.get('/tasks/user', authenticate, controller.getTasksByUser.bind(controller));
router.get('/tasks/:id', authenticate, controller.getTaskById.bind(controller));
router.patch('/tasks/update/:id', authenticate, controller.updateTask.bind(controller));
router.delete('/tasks/delete/:id', authenticate, controller.deleteTask.bind(controller));

export default router;
