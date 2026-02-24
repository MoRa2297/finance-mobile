import apiClient from './api-client';
import { BankCard, EditBankCard } from '@/types';

const cardService = {
  getCards: async (): Promise<BankCard[]> => {
    const { data } = await apiClient.get<BankCard[]>('/cards');
    return data;
  },

  getCard: async (id: number): Promise<BankCard> => {
    const { data } = await apiClient.get<BankCard>(`/cards/${id}`);
    return data;
  },

  createCard: async (payload: EditBankCard): Promise<BankCard> => {
    const { data } = await apiClient.post<BankCard>('/cards', payload);
    return data;
  },

  updateCard: async (id: number, payload: EditBankCard): Promise<BankCard> => {
    const { data } = await apiClient.put<BankCard>(`/cards/${id}`, payload);
    return data;
  },

  deleteCard: async (id: number): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/cards/${id}`,
    );
    return data;
  },
};

export default cardService;
