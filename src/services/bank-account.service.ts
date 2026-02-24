import apiClient from './api-client';
import { BankAccount, EditBankAccount } from '@/types';

const bankAccountService = {
  getBankAccounts: async (): Promise<BankAccount[]> => {
    const { data } = await apiClient.get<BankAccount[]>('/bank-accounts');
    return data;
  },

  getBankAccount: async (id: number): Promise<BankAccount> => {
    const { data } = await apiClient.get<BankAccount>(`/bank-accounts/${id}`);
    return data;
  },

  createBankAccount: async (payload: EditBankAccount): Promise<BankAccount> => {
    const { data } = await apiClient.post<BankAccount>(
      '/bank-accounts',
      payload,
    );
    return data;
  },

  updateBankAccount: async (
    id: number,
    payload: EditBankAccount,
  ): Promise<BankAccount> => {
    const { data } = await apiClient.put<BankAccount>(
      `/bank-accounts/${id}`,
      payload,
    );
    return data;
  },

  deleteBankAccount: async (id: number): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/bank-accounts/${id}`,
    );
    return data;
  },
};

export default bankAccountService;
