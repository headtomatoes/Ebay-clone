// Simulated database
const mockDB = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    roles: ['ROLE_ADMIN']
  },
  {
    id: 2,
    username: 'user',
    email: 'user@example.com',
    password: 'user123',
    roles: ['ROLE_USER']
  }
];

let nextId = 3;

export const mockRegister = (username, email, password) => {
  // Check if username already exists
  const existing = mockDB.find((u) => u.username === username);
  if (existing) return null; // username taken

  // Create new user
  const newUser = {
    id: nextId++,
    username,
    email,
    password,
    roles: ['ROLE_USER']
  };

  mockDB.push(newUser);

  return {
    token: 'mock-token-456',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      roles: newUser.roles
    }
  };
};
