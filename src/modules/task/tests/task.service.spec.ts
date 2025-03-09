import { AppError } from '../../../core/errors/appError';
import { UserService } from '../../user/user.service';
import { TaskService } from '../task.service';

describe('TaskService for correct returns and errors', () => {
  let taskService: TaskService;
  let userService: UserService;

  const taskData = {
    title: 'title test',
    description: 'description test',
  };

  const userData = {
    name: 'Stanley Mack',
    email: 'cufkeculu@dihak.ba',
    password: '#CCBE02#4A8632',
  };

  beforeEach(() => {
    taskService = new TaskService();
    userService = new UserService();
  });

  test('createTask()', async () => {
    const user = await userService.createUser(userData);
    const userId = String(user._id);
    const newTask = { ...taskData, user: userId };

    const task = await taskService.createTask(newTask);
    expect(task.title).toBe(taskData.title);
    expect(task).toHaveProperty('_id');
    expect(task).toHaveProperty('createdAt');
    expect(task.status).toBe('pendente');

    await expect(taskService.createTask({ user: userId })).rejects.toThrow(AppError);
  });

  test('getAllTasks()', async () => {
    const beforeCreate = await taskService.getAllTasks();
    expect(beforeCreate.length).toBe(0);

    const user = await userService.createUser(userData);
    const userId = String(user._id);
    const newTask = { ...taskData, user: userId };

    await taskService.createTask(newTask);
    await taskService.createTask(newTask);
    await taskService.createTask({ ...newTask, status: 'em progresso' });

    const tasks = await taskService.getAllTasks();
    expect(tasks[0]).toHaveProperty('_id');
    expect(tasks[0].title).toBe(taskData.title);
    expect(tasks[0].status).toBe('pendente');
    expect(tasks[2].status).toBe('em progresso');
    expect(tasks[3]).toBeUndefined();
  });

  test('getTasksByUser()', async () => {
    const user = await userService.createUser(userData);
    const userId = String(user._id);
    const newTask = { ...taskData, user: userId };

    await taskService.createTask(newTask);
    await taskService.createTask({ ...newTask, status: 'em progresso' });

    const tasks = await taskService.getTasksByUser(userId);
    expect(tasks[0]).toHaveProperty('_id');
    expect(String(tasks[0].user)).toBe(userId);
    expect(tasks[0].status).toBe('pendente');
    expect(tasks[1].status).toBe('em progresso');
    expect(tasks[2]).toBeUndefined();
  });

  test('getTaskById()', async () => {
    const user = await userService.createUser(userData);
    const userId = String(user._id);
    const newTask = { ...taskData, user: userId };

    const response = await taskService.createTask(newTask);

    const task = await taskService.getTaskById(String(response._id));
    expect(task).toHaveProperty('_id');
    expect(String(task._id)).toBe(String(response._id));
    expect(task.title).toBe(taskData.title);
  });

  test('updateTaskById()', async () => {
    const user = await userService.createUser(userData);
    const userId = String(user._id);
    const newTask = { ...taskData, user: userId };

    const mockRequest = {
      user: { id: userId },
      params: { id: userId },
    } as any;

    const response = await taskService.createTask(newTask);

    await taskService.updateTask(
      String(response._id),
      { title: 'updated task', status: 'concluída' },
      mockRequest,
    );

    const task = await taskService.getTaskById(String(response._id));
    expect(task.title).toBe('updated task');
    expect(task.status).toBe('concluída');
    expect(String(task.user)).toBe(userId);
  });

  test('deleteTask()', async () => {
    const user = await userService.createUser(userData);
    const userId = String(user._id);
    const newTask = { ...taskData, user: userId };

    const mockRequest = {
      user: { id: userId },
      params: { id: userId },
    } as any;

    const response = await taskService.createTask(newTask);

    await taskService.deleteTask(String(response._id), mockRequest);
    await expect(taskService.getTaskById(String(response._id))).rejects.toThrow(AppError);
  });
});
