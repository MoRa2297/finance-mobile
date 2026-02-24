import apiClient from './api-client';
import { Transaction, EditTransaction } from '@/types';

export interface TransactionFilters {
  month?: number;
  year?: number;
  categoryId?: number;
  type?: 'income' | 'expense' | 'card_expense';
  bankAccountId?: number;
  cardAccountId?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedTransactions {
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const transactionService = {
  getTransactions: async (
    filters?: TransactionFilters,
  ): Promise<PaginatedTransactions> => {
    const { data } = await apiClient.get<PaginatedTransactions>(
      '/transactions',
      { params: filters },
    );
    return data;
  },

  getTransaction: async (id: number): Promise<Transaction> => {
    const { data } = await apiClient.get<Transaction>(`/transactions/${id}`);
    return data;
  },

  createTransaction: async (payload: EditTransaction): Promise<Transaction> => {
    const { data } = await apiClient.post<Transaction>(
      '/transactions',
      payload,
    );
    return data;
  },

  updateTransaction: async (
    id: number,
    payload: EditTransaction,
  ): Promise<Transaction> => {
    const { data } = await apiClient.put<Transaction>(
      `/transactions/${id}`,
      payload,
    );
    return data;
  },

  deleteTransaction: async (id: number): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/transactions/${id}`,
    );
    return data;
  },
};

export default transactionService;
