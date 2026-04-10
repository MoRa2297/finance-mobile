import apiClient from './api-client';
import {
  Transaction,
  CreateTransactionPayload,
  CreateTransferPayload,
  UpdateTransactionPayload,
  TransactionFilters,
  TransactionMeta,
} from '@/types';

export interface TransactionListResponse {
  data: Transaction[];
  meta: TransactionMeta;
}

export interface TransferDetailResponse {
  id: number;
  fromTransaction: Transaction;
  toTransaction: Transaction;
  fromAccount: { id: number; name: string };
  toAccount: { id: number; name: string };
}

const transactionService = {
  getTransactions: async (
    filters: TransactionFilters = {},
    signal?: AbortSignal,
  ) => {
    const { data } = await apiClient.get<TransactionListResponse>(
      '/transactions',
      {
        params: filters,
        signal,
      },
    );
    return data;
  },

  getTransaction: async (id: number, signal?: AbortSignal) => {
    const { data } = await apiClient.get<Transaction>(`/transactions/${id}`, {
      signal,
    });
    return data;
  },

  createTransaction: async (
    payload: CreateTransactionPayload,
  ): Promise<Transaction> => {
    const { data } = await apiClient.post<Transaction>(
      '/transactions',
      payload,
    );
    return data;
  },

  createTransfer: async (
    payload: CreateTransferPayload,
  ): Promise<TransferDetailResponse> => {
    const { data } = await apiClient.post<TransferDetailResponse>(
      '/transactions/transfer',
      payload,
    );
    return data;
  },

  updateTransaction: async (
    id: number,
    payload: UpdateTransactionPayload,
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

  deleteTransfer: async (transferDetailId: number): Promise<void> => {
    await apiClient.delete(`/transactions/transfer/${transferDetailId}`);
  },

  updateTransfer: async (
    transferDetailId: number,
    payload: CreateTransferPayload,
  ): Promise<TransferDetailResponse> => {
    const { data } = await apiClient.post<TransferDetailResponse>(
      `/transactions/transfer/${transferDetailId}`,
      payload,
    );
    return data;
  },
};

export default transactionService;
