import apiClient from './api-client';
import { Frequency } from '@/types';

export type RecurringType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export interface UpdateRecurringRulePayload {
  description?: string;
  amount?: number;
  type?: RecurringType;
  frequency?: Frequency;
  startDate?: string;
  endDate?: string;
  note?: string;
  isActive?: boolean;
  categoryId?: number;
  bankAccountId?: number;
  cardAccountId?: number;
  fromAccountId?: number;
  toAccountId?: number;
}

const recurringService = {
  updateRecurringRule: async (
    id: number,
    payload: UpdateRecurringRulePayload,
  ): Promise<void> => {
    await apiClient.put(`/recurring/${id}`, payload);
  },
};

export default recurringService;
