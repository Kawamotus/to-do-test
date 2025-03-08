import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate } from '../../core/middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

router.post('/users', userController.createUser.bind(userController));
router.get('/users', authenticate, userController.getUsers.bind(userController));
router.get('/users/:id', authenticate, userController.getUserById.bind(userController));
router.patch('/users/:id', authenticate, userController.updateUser.bind(userController));
router.delete('/users/:id', authenticate, userController.deleteUser.bind(userController));

export default router;
