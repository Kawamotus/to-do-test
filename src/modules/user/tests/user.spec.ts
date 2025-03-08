import { testServer } from '../../../tests/test-utils';
import { User } from '../user.model';

describe('User module', () => {
  const userData = {
    name: 'Nathaniel Graham',
    email: 'meden@wos.mh',
    password: '#D5689F#DF7217',
  };

  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('POST /users - should create a new user', async () => {
    const response = await testServer.post('/users').send(userData).expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.email).toBe(userData.email);
  });
});
