export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  birthDate: Date | null;
  sex: string | null;
  imageUrl: string | null;
  acceptedTerms: boolean;
  updateDate: Date;
  createdDate: Date;
}

export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  reset: () => void;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  surname: string;
  acceptedTerms: boolean;
}
