import { i18n } from '@/i18n';

// TODO save it in a global helper already duplicated
const t = (key: string) => i18n.t(key);

export enum AuthErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  TRY_AGAIN = 'TRY_AGAIN',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN',
}

interface ApiError {
  error?: string;
  details?: string;
}

export const getAuthErrorMessage = (error: ApiError): string => {
  switch (error.error) {
    case AuthErrorCode.UNAUTHORIZED:
      return t('messages.apiErrors.unauthorizedError');

    case AuthErrorCode.TRY_AGAIN:
      return error.details || t('messages.apiErrors.tryAgainError');

    case AuthErrorCode.NETWORK_ERROR:
      return t('messages.apiErrors.networkError');

    default:
      return t('messages.apiErrors.genericError');
  }
};

export const isAuthError = (error: unknown): error is ApiError => {
  return typeof error === 'object' && error !== null && 'error' in error;
};
