// TODO to reorder and improve security at the end of the UI
import axios, { AxiosResponse } from 'axios';
import {
  BankAccount,
  BankAccountType,
  BankCard,
  BankType,
  CardType,
  Category,
  CategoryIcon,
  Color,
  EditBankAccount,
  EditBankCard,
  EditCategory,
  EditTransaction,
  LogInResponse,
  SignInResponse,
  Transaction,
  User,
} from '@/types';

// Config
const BASE_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const handleServerError = (
  error: unknown,
): { error: string; code?: string; details?: string } => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return {
            error: 'TRY_AGAIN',
            code: data?.error?.code || undefined,
            details: data?.error?.details || undefined,
          };
        case 401:
          return {
            error: 'UNAUTHORIZED',
            code: data?.error?.code || undefined,
            details: data?.error?.details || undefined,
          };
        case 500:
        case 503:
        default:
          return {
            error: 'GENERAL',
            code: data?.error?.code || undefined,
            details: data?.error?.details || undefined,
          };
      }
    }
  }

  return {
    error: 'GENERAL',
  };
};

const get = async ({
  url,
  token,
}: {
  url: string;
  token?: string;
}): Promise<{ data?: any; error?: string }> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    console.log('GET:', `${BASE_API_URL}/${url}`);
    const response: AxiosResponse = await axios.get(
      `${BASE_API_URL}/${url}`,
      config,
    );

    return { data: response.data };
  } catch (error) {
    console.log('GET error:', error);
    throw handleServerError(error);
  }
};

const post = async ({
  path,
  body,
  token,
}: {
  path: string;
  body: object;
  token?: string;
}): Promise<{ data?: any; error?: string }> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    console.log('POST:', `${BASE_API_URL}/${path}`);
    const response: AxiosResponse = await axios.post(
      `${BASE_API_URL}/${path}`,
      body,
      config,
    );

    return { data: response.data };
  } catch (error) {
    console.log('POST error:', error);
    throw handleServerError(error);
  }
};

const patch = async ({
  path,
  body,
  token,
}: {
  path: string;
  body: object;
  token?: string;
}): Promise<{ data?: any; error?: string }> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    console.log('PATCH:', `${BASE_API_URL}/${path}`);
    const response: AxiosResponse = await axios.patch(
      `${BASE_API_URL}/${path}`,
      body,
      config,
    );

    return { data: response.data };
  } catch (error) {
    console.log('PATCH error:', error);
    throw handleServerError(error);
  }
};

const apiDelete = async ({
  path,
  token,
}: {
  path: string;
  token?: string;
}): Promise<{ data?: any; error?: string }> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    console.log('DELETE:', `${BASE_API_URL}/${path}`);
    const response: AxiosResponse = await axios.delete(
      `${BASE_API_URL}/${path}`,
      config,
    );

    return { data: response.data };
  } catch (error) {
    console.log('DELETE error:', error);
    throw handleServerError(error);
  }
};

// ============ AUTH ============

const signup = async (
  email: string,
  password: string,
  acceptedTerms: boolean,
  name: string,
): Promise<SignInResponse> => {
  const response = await post({
    path: 'auth/signup',
    body: { email, password, acceptedTerms, name },
  });

  return {
    token: response?.data.token,
    user: response?.data.user,
  };
};

const login = async (
  email: string,
  password: string,
): Promise<LogInResponse> => {
  const response = await post({
    path: 'auth/login',
    body: { email, password },
  });

  return {
    token: response?.data.token,
    user: response?.data.user,
  };
};

const me = async (sessionToken: string): Promise<{ user: User }> => {
  const response = await get({
    url: 'auth/me',
    token: sessionToken,
  });

  return {
    user: response?.data.user,
  };
};

const deleteUser = async (
  sessionToken: string,
  userEmail: string,
): Promise<{ status: string }> => {
  const response = await apiDelete({
    path: `auth/basic/delete-profile/${userEmail}`,
    token: sessionToken,
  });

  return {
    status: response?.data.status,
  };
};

const updateUser = async (
  sessionToken: string,
  user: Partial<User>,
): Promise<{ user: string }> => {
  const response = await patch({
    path: 'auth/basic/update-profile',
    token: sessionToken,
    body: user,
  });

  return {
    user: response?.data.status,
  };
};

// ============ COLORS ============

const getColors = async (
  sessionToken: string,
): Promise<{ colors: Color[] }> => {
  const response = await get({
    url: 'color/colors',
    token: sessionToken,
  });

  return {
    colors: response?.data.colors,
  };
};

// ============ CATEGORY ICONS ============

const getCategoryIcons = async (
  sessionToken: string,
): Promise<{ categoryIcons: CategoryIcon[] }> => {
  const response = await get({
    url: 'categoryIcon/categoryIcons',
    token: sessionToken,
  });

  return {
    categoryIcons: response?.data.categoryIcons,
  };
};

// ============ CATEGORIES ============

const getCategories = async (
  sessionToken: string,
  userId: string,
): Promise<{ categories: Category[] }> => {
  const response = await get({
    url: `category/user/${userId}`,
    token: sessionToken,
  });

  return {
    categories: response?.data.categories,
  };
};

const createCategory = async (
  sessionToken: string,
  category: EditCategory,
): Promise<{ category: Category }> => {
  const response = await post({
    path: 'category',
    body: category,
    token: sessionToken,
  });

  return {
    category: response?.data.category,
  };
};

const updateCategory = async (
  sessionToken: string,
  category: EditCategory,
): Promise<{ category: Category }> => {
  const response = await patch({
    path: 'category',
    body: category,
    token: sessionToken,
  });

  return {
    category: response?.data.category,
  };
};

const deleteCategory = async (
  sessionToken: string,
  categoryId: string,
): Promise<{ category: Category[] }> => {
  const response = await apiDelete({
    path: `category/${categoryId}`,
    token: sessionToken,
  });

  return {
    category: response?.data.category,
  };
};

// ============ BANK TYPES ============

const getBankTypes = async (
  sessionToken: string,
): Promise<{ bankTypes: BankType[] }> => {
  const response = await get({
    url: 'bankType/bankTypes',
    token: sessionToken,
  });

  return {
    bankTypes: response?.data.bankTypes,
  };
};

const getBankAccountTypes = async (
  sessionToken: string,
): Promise<{ bankAccountTypes: BankAccountType[] }> => {
  const response = await get({
    url: 'bankAccountType/bankAccountTypes',
    token: sessionToken,
  });

  return {
    bankAccountTypes: response?.data.bankAccountTypes,
  };
};

// ============ BANK ACCOUNTS ============

const getBankAccounts = async (
  sessionToken: string,
  userId: string,
): Promise<{ bankAccounts: BankAccount[] }> => {
  const response = await get({
    url: `bankAccount/user/${userId}`,
    token: sessionToken,
  });

  return {
    bankAccounts: response?.data.bankAccounts,
  };
};

const createBankAccount = async (
  sessionToken: string,
  bankAccount: EditBankAccount,
): Promise<{ bankAccount: BankAccount }> => {
  const response = await post({
    path: 'bankAccount',
    body: bankAccount,
    token: sessionToken,
  });

  return {
    bankAccount: response?.data.bankAccount,
  };
};

const updateBankAccount = async (
  sessionToken: string,
  bankAccount: EditBankAccount,
): Promise<{ bankAccount: BankAccount }> => {
  const response = await patch({
    path: 'bankAccount',
    body: bankAccount,
    token: sessionToken,
  });

  return {
    bankAccount: response?.data.bankAccount,
  };
};

const deleteBankAccount = async (
  sessionToken: string,
  bankAccountId: string,
): Promise<{ category: BankAccount[] }> => {
  const response = await apiDelete({
    path: `bankAccount/${bankAccountId}`,
    token: sessionToken,
  });

  return {
    category: response?.data.category,
  };
};

// ============ CARD TYPES ============

const getCardTypes = async (
  sessionToken: string,
): Promise<{ cardTypes: CardType[] }> => {
  const response = await get({
    url: 'cardType/cardTypes',
    token: sessionToken,
  });

  return {
    cardTypes: response?.data.cardTypes,
  };
};

// ============ BANK CARDS ============

const getBankCard = async (
  sessionToken: string,
  userId: string,
): Promise<{ cardAccounts: BankCard[] }> => {
  const response = await get({
    url: `cardAccount/user/${userId}`,
    token: sessionToken,
  });

  return {
    cardAccounts: response?.data.cardAccounts,
  };
};

const createBankCard = async (
  sessionToken: string,
  bankCard: EditBankCard,
): Promise<{ cardAccount: BankCard }> => {
  const response = await post({
    path: 'cardAccount',
    body: bankCard,
    token: sessionToken,
  });

  return {
    cardAccount: response?.data.cardAccount,
  };
};

const updateBankCard = async (
  sessionToken: string,
  bankCard: EditBankCard,
): Promise<{ cardAccount: BankCard }> => {
  const response = await patch({
    path: 'cardAccount',
    body: bankCard,
    token: sessionToken,
  });

  return {
    cardAccount: response?.data.cardAccount,
  };
};

const deleteBankCard = async (
  sessionToken: string,
  bankCardId: string,
): Promise<{ cardAccount: BankCard }> => {
  const response = await apiDelete({
    path: `cardAccount/${bankCardId}`,
    token: sessionToken,
  });

  return {
    cardAccount: response?.data.cardAccount,
  };
};

// ============ TRANSACTIONS ============

const getTransactions = async (
  sessionToken: string,
  userId: string,
): Promise<{ transactions: Transaction[] }> => {
  const response = await get({
    url: `transaction/user/${userId}`,
    token: sessionToken,
  });

  return {
    transactions: response?.data.transactions,
  };
};

const createTransaction = async (
  sessionToken: string,
  transaction: EditTransaction,
): Promise<{ transaction: Transaction }> => {
  const response = await post({
    path: 'transaction',
    body: transaction,
    token: sessionToken,
  });

  return {
    transaction: response?.data.transaction,
  };
};

const updateTransaction = async (
  sessionToken: string,
  transaction: EditTransaction,
): Promise<{ transaction: Transaction }> => {
  const response = await patch({
    path: 'transaction',
    body: transaction,
    token: sessionToken,
  });

  return {
    transaction: response?.data.transaction,
  };
};

const deleteTransaction = async (
  sessionToken: string,
  transactionId: string,
): Promise<{ transaction: Transaction }> => {
  const response = await apiDelete({
    path: `transaction/${transactionId}`,
    token: sessionToken,
  });

  return {
    transaction: response?.data.transaction,
  };
};

export default {
  get,
  post,
  patch,
  apiDelete,
  signup,
  login,
  me,
  deleteUser,
  updateUser,
  getColors,
  getCategoryIcons,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBankTypes,
  getBankAccountTypes,
  getBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  getCardTypes,
  getBankCard,
  createBankCard,
  updateBankCard,
  deleteBankCard,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
