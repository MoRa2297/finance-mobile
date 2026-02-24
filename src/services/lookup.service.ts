import apiClient from './api-client';
import {
  Color,
  CategoryIcon,
  BankType,
  BankAccountType,
  CardType,
} from '@/types';

const lookupService = {
  getColors: async (): Promise<Color[]> => {
    const { data } = await apiClient.get<Color[]>('/lookup/colors');
    return data;
  },

  getCategoryIcons: async (): Promise<CategoryIcon[]> => {
    const { data } = await apiClient.get<CategoryIcon[]>(
      '/lookup/category-icons',
    );
    return data;
  },

  getBankTypes: async (): Promise<BankType[]> => {
    const { data } = await apiClient.get<BankType[]>('/lookup/bank-types');
    return data;
  },

  getBankAccountTypes: async (): Promise<BankAccountType[]> => {
    const { data } = await apiClient.get<BankAccountType[]>(
      '/lookup/bank-account-types',
    );
    return data;
  },

  getCardTypes: async (): Promise<CardType[]> => {
    const { data } = await apiClient.get<CardType[]>('/lookup/card-types');
    return data;
  },
};

export default lookupService;
