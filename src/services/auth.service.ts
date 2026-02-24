import apiClient from './api-client';
import { User } from '@/types';

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  surname: string;
  acceptedTerms: boolean;
}

export interface UpdateProfilePayload {
  name?: string;
  surname?: string;
  birthDate?: string;
  sex?: string;
  imageUrl?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      '/auth/register',
      payload,
    );
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    console.log('login: ', data);
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<User> => {
    const { data } = await apiClient.put<User>('/auth/profile', payload);
    return data;
  },

  changePassword: async (
    payload: ChangePasswordPayload,
  ): Promise<{ message: string }> => {
    const { data } = await apiClient.put<{ message: string }>(
      '/auth/change-password',
      payload,
    );
    return data;
  },

  deleteAccount: async (): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      '/auth/profile',
    );
    return data;
  },
};

export default authService;
