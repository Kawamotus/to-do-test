import { AppError } from '../../../core/errors/appError';
import { UserService } from '../user.service';

describe('UserService', () => {
  let userService: UserService;

  const userData = {
    name: 'Willie Clarke',
    email: 'cu@hojiljo.bs',
    password: '#91EBB3#4103EF',
  };

  beforeEach(() => {
    userService = new UserService();
  });

  test('createUser() - should create a new user', async () => {
    const user = await userService.createUser(userData);

    expect(user).toHaveProperty('_id');
    expect(user.email).toBe('cu@hojiljo.bs');

    await expect(userService.createUser(userData)).rejects.toThrow(AppError);

    await expect(
      userService.createUser({ name: 'a', email: 'invalidemail', password: '12345' }),
    ).rejects.toThrow(AppError);
  });

  test('getUsers() - should return all users', async () => {
    await userService.createUser(userData);

    const users = await userService.getUsers();

    expect(users[0]).toHaveProperty('_id');
    expect(users[0].email).toBe('cu@hojiljo.bs');
  });

  test('getUserById() - should return an user by id', async () => {
    const newUser = await userService.createUser(userData);
    const userId = String(newUser._id);

    const response = await userService.getUserById(userId);

    expect(response.name).toBe(userData.name);
    expect(response).toHaveProperty('_id');
  });

  test('updateUser() - should update an user', async () => {
    const newUser = await userService.createUser(userData);
    const userId = String(newUser._id);

    const mockRequest = {
      user: { id: userId },
      params: { id: userId },
    } as any;

    const updatedUser = await userService.updateUser(
      userId,
      { name: 'Clarence Knight' },
      mockRequest,
    );

    await expect(userService.updateUser(userId, { name: 'a' }, mockRequest)).rejects.toThrow(
      AppError,
    );

    expect(updatedUser).toHaveProperty('_id');
    expect(updatedUser.name).toEqual('Clarence Knight');
  });

  test('deleteUser() - should delete an user', async () => {
    const newUser = await userService.createUser(userData);
    const userId = String(newUser._id);

    const mockRequest = {
      user: { id: userId },
      params: { id: userId },
    } as any;

    const fakeId = '665f1a2e3c4d5e6f7g8h9i0j';
    await expect(userService.deleteUser(fakeId, mockRequest)).rejects.toThrow(AppError);

    await userService.deleteUser(userId, mockRequest);
  });
});
