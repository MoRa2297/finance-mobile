export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  surname: string;
  birthDate: Date;
  sex: string;
  imageUrl: string;
  acceptedTerms: boolean;
  token: string;
  updateDate: Date;
  createdDate: Date;
}

export interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  clearError: () => void;
  reset: () => void;

  updateUser: (user: User) => void;
}
