import {
  CreateTransactionPayload,
  UpdateTransactionPayload,
  TransactionFilters,
} from '@/types';
import apiClient from '@services/api-client';

export const getTransactions = async (filters?: TransactionFilters) => {
  const res = await apiClient.get('/transactions', { params: filters });
  return res.data;
};

export const createTransaction = async (payload: CreateTransactionPayload) => {
  const res = await apiClient.post('/transactions', payload);
  return res.data;
};

export const updateTransaction = async (
  id: number,
  payload: UpdateTransactionPayload,
) => {
  const res = await apiClient.put(`/transactions/${id}`, payload);
  return res.data;
};

export const deleteTransaction = async (id: number) => {
  const res = await apiClient.delete(`/transactions/${id}`);
  return res.data;
};
