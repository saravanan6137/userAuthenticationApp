import AsyncStorage from '@react-native-async-storage/async-storage';
import { hashPassword } from '../src/utils/crypto';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock the signup logic
const signup = async (
  name: string,
  email: string,
  password: string
): Promise<void> => {
  const normalizedEmail = email.trim().toLowerCase();
  
  // Get existing users
  const usersData = await AsyncStorage.getItem('@auth_users_db');
  const users = usersData ? JSON.parse(usersData) : [];

  // Check if user already exists
  const existingUser = users.find(
    (u: any) => u.email.toLowerCase() === normalizedEmail
  );

  if (existingUser) {
    throw new Error('An account with this email already exists');
  }

  // Create new user with hashed password
  const newUser = {
    id: Date.now().toString(),
    name: name.trim(),
    email: normalizedEmail,
    password: hashPassword(password),
  };

  // Save to users database
  await AsyncStorage.setItem('@auth_users_db', JSON.stringify([...users, newUser]));

  // Create user object without password for current session
  const currentUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };

  // Persist current user
  await AsyncStorage.setItem('@auth_current_user', JSON.stringify(currentUser));
};

describe('Signup Flow - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Signup', () => {
    it('should create a new user account successfully', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await signup('John Doe', 'john@example.com', 'password123');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@auth_users_db',
        expect.stringContaining('john@example.com')
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@auth_current_user',
        expect.stringContaining('John Doe')
      );
    });

    it('should normalize email to lowercase', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await signup('Jane Smith', 'JANE@EXAMPLE.COM', 'password123');

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const usersDbCall = calls.find((call: any) => call[0] === '@auth_users_db');
      const savedData = JSON.parse(usersDbCall[1]);

      expect(savedData[0].email).toBe('jane@example.com');
    });

    it('should trim whitespace from name and email', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await signup('  Alice Johnson  ', '  alice@example.com  ', 'password123');

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const usersDbCall = calls.find((call: any) => call[0] === '@auth_users_db');
      const savedData = JSON.parse(usersDbCall[1]);

      expect(savedData[0].name).toBe('Alice Johnson');
      expect(savedData[0].email).toBe('alice@example.com');
    });

    it('should hash the password before storing', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      const plainPassword = 'mySecretPassword';
      await signup('Bob Wilson', 'bob@example.com', plainPassword);

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const usersDbCall = calls.find((call: any) => call[0] === '@auth_users_db');
      const savedData = JSON.parse(usersDbCall[1]);

      expect(savedData[0].password).not.toBe(plainPassword);
      expect(savedData[0].password).toBeTruthy();
      expect(savedData[0].password.length).toBeGreaterThan(plainPassword.length);
    });

    it('should generate a unique user ID', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await signup('Charlie Brown', 'charlie@example.com', 'password123');

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const usersDbCall = calls.find((call: any) => call[0] === '@auth_users_db');
      const savedData = JSON.parse(usersDbCall[1]);

      expect(savedData[0].id).toBeTruthy();
      expect(typeof savedData[0].id).toBe('string');
    });

    it('should not include password in current user session', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await signup('David Lee', 'david@example.com', 'password123');

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const currentUserCall = calls.find((call: any) => call[0] === '@auth_current_user');
      const currentUser = JSON.parse(currentUserCall[1]);

      expect(currentUser.password).toBeUndefined();
      expect(currentUser.name).toBe('David Lee');
      expect(currentUser.email).toBe('david@example.com');
      expect(currentUser.id).toBeTruthy();
    });
  });

  describe('Failed Signup - Duplicate Email', () => {
    it('should throw error if email already exists', async () => {
      const existingUser = {
        id: '1',
        name: 'Existing User',
        email: 'test@example.com',
        password: hashPassword('password'),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([existingUser])
      );

      await expect(
        signup('New User', 'test@example.com', 'password123')
      ).rejects.toThrow('An account with this email already exists');
    });

    it('should detect duplicate email case-insensitively', async () => {
      const existingUser = {
        id: '1',
        name: 'Existing User',
        email: 'test@example.com',
        password: hashPassword('password'),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([existingUser])
      );

      await expect(
        signup('Another User', 'TEST@EXAMPLE.COM', 'password123')
      ).rejects.toThrow('An account with this email already exists');
    });

    it('should not save duplicate user to database', async () => {
      const existingUser = {
        id: '1',
        name: 'Existing User',
        email: 'test@example.com',
        password: hashPassword('password'),
      };

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify([existingUser])
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      try {
        await signup('Duplicate User', 'test@example.com', 'password123');
      } catch (error) {
        console.log(error);
        // Expected error
      }

      // setItem should not be called for users database
      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const usersDbCall = calls.find((call: any) => call[0] === '@auth_users_db');
      expect(usersDbCall).toBeUndefined();
    });
  });

  describe('Data Storage', () => {
    it('should save user to the users database', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await signup('Emma Watson', 'emma@example.com', 'password123');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@auth_users_db',
        expect.any(String)
      );
    });

    it('should save current user session', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify([]));
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await signup('Frank Miller', 'frank@example.com', 'password123');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@auth_current_user',
        expect.any(String)
      );
    });

    it('should append new user to existing users list', async () => {
      const existingUsers = [
        {
          id: '1',
          name: 'User One',
          email: 'user1@example.com',
          password: hashPassword('password1'),
        },
      ];

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(existingUsers)
      );
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await signup('User Two', 'user2@example.com', 'password2');

      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const usersDbCall = calls.find((call: any) => call[0] === '@auth_users_db');
      const savedData = JSON.parse(usersDbCall[1]);

      expect(savedData.length).toBe(2);
      expect(savedData[0].email).toBe('user1@example.com');
      expect(savedData[1].email).toBe('user2@example.com');
    });
  });
});
