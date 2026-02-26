import { BankCard, EditBankCard } from '@/types';

export interface CardState {
  cards: BankCard[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  fetchCards: () => Promise<void>;
  createCard: (payload: EditBankCard) => Promise<void>;
  updateCard: (id: number, payload: EditBankCard) => Promise<void>;
  deleteCard: (id: number) => Promise<void>;
  reset: () => void;
}
