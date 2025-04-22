export const mockLogin = (username, password) => {
  const fakeUsers = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      email: 'admin@example.com',
      roles: ['ROLE_ADMIN']
    },
    {
      id: 2,
      username: 'user',
      password: 'user123',
      email: 'user@example.com',
      roles: ['ROLE_USER']
    },
    {
      id: 3,
      username: 'seller',
      password: 'seller123',
      email: 'seller@example.com',
      roles: ['ROLE_SELLER']
    },
    {
      id: 4,
      username: 'buyer',
      password: 'buyer123',
      email: 'buyer@example.com',
      roles: ['ROLE_BUYER']
    },
    {
      id: 5,
      username: 'superadmin',
      password: 'super123',
      email: 'superadmin@example.com',
      roles: ['ROLE_ADMIN', 'ROLE_SELLER', 'ROLE_BUYER']
    }
  ];

  const user = fakeUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) return null;

  return {
    token: 'mock-token-123',
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles
    }
  };
};
