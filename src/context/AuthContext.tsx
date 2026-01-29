import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthContextType, StoredUser } from '../types/auth';
import { hashPassword, verifyPassword } from '../utils/crypto';

// Storage keys
const STORAGE_KEYS = {
  CURRENT_USER: '@auth_current_user',
  USERS_DB: '@auth_users_db',
};

// Create the context with undefined default
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(
          STORAGE_KEYS.CURRENT_USER,
        );
        if (storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Get all stored users
  const getStoredUsers = async (): Promise<StoredUser[]> => {
    try {
      const usersData = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error getting stored users:', error);
      return [];
    }
  };

  // Save users to storage
  const saveStoredUsers = async (users: StoredUser[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
      throw new Error('Failed to save user data');
    }
  };

  // Login function
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const normalizedEmail = email.trim().toLowerCase();
      const users = await getStoredUsers();

      const foundUser = users.find(
        u =>
          u.email.toLowerCase() === normalizedEmail &&
          verifyPassword(password.trim(), u.password), // Verify hashed password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Create user object without password
      const loggedInUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      };

      // Persist current user
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(loggedInUser),
      );

      setUser(loggedInUser);
    },
    [],
  );

  // Signup function
  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<void> => {
      const normalizedEmail = email.trim().toLowerCase();
      const users = await getStoredUsers();

      // Check if user already exists
      const existingUser = users.find(
        u => u.email.toLowerCase() === normalizedEmail,
      );

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user with hashed password
      const newUser: StoredUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: normalizedEmail,
        password: hashPassword(password.trim()), // Hash the password
      };

      // Save to users database
      await saveStoredUsers([...users, newUser]);

      // Create user object without password for state
      const loggedInUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };

      // Persist current user
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(loggedInUser),
      );

      setUser(loggedInUser);
    },
    [],
  );

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
  }, []);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
