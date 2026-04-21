import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { useAuthStore } from '@/stores/auth/useAuthStore';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ApiError {
  error:
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'NOT_FOUND'
    | 'VALIDATION'
    | 'RATE_LIMITED'
    | 'GENERAL';
  message?: string;
  statusCode?: number;
}

// ─── Instance ──────────────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ───────────────────────────────────────────────────────

// Automatically attaches JWT token to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response Interceptor ──────────────────────────────────────────────────────

// Unwraps the backend response shape { data: { data: ... } } → { data: ... }
// Handles 401 by logging out the user automatically
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    response.data = response.data?.data ?? response.data;
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(handleApiError(error));
  },
);

// ─── Error Handler ─────────────────────────────────────────────────────────────

const handleApiError = (error: AxiosError): ApiError => {
  if (!error.response) {
    return {
      error: 'GENERAL',
      message: 'Network error — check your connection',
    };
  }

  const { status, data } = error.response as { status: number; data: any };
  const message = data?.message ?? 'An unexpected error occurred';

  switch (status) {
    case 400:
      return { error: 'VALIDATION', message, statusCode: 400 };
    case 401:
      return { error: 'UNAUTHORIZED', message, statusCode: 401 };
    case 403:
      return { error: 'FORBIDDEN', message, statusCode: 403 };
    case 404:
      return { error: 'NOT_FOUND', message, statusCode: 404 };
    case 429:
      return {
        error: 'RATE_LIMITED',
        message: 'Too many requests — try again later',
        statusCode: 429,
      };
    case 500:
    case 503:
    default:
      return { error: 'GENERAL', message, statusCode: status };
  }
};

export default apiClient;
