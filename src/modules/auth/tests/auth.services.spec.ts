import { AppError } from '../../../core/errors/appError';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
  let userService: UserService;
  let authService: AuthService;

  const userData = {
    name: 'Adeline Welch',
    email: 'jiupu@jiar.sy',
    password: '#1DBFFA#BA5655',
  };

  beforeEach(() => {
    userService = new UserService();
    authService = new AuthService();
  });

  test('login() - should return a token', async () => {
    await userService.createUser(userData);

    await authService.login(userData.email, userData.password);
    await expect(authService.login('wrongemail@email.com', userData.password)).rejects.toThrow(
      AppError,
    );
  });
});
