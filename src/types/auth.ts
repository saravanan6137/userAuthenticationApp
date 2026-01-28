export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface StoredUser extends User {
  password: string;
}

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};
