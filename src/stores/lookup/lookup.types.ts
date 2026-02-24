import {
  Color,
  CategoryIcon,
  BankType,
  BankAccountType,
  CardType,
} from '@/types';

export interface LookupState {
  // State
  colors: Color[];
  categoryIcons: CategoryIcon[];
  bankTypes: BankType[];
  bankAccountTypes: BankAccountType[];
  cardTypes: CardType[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAll: () => Promise<void>;
  reset: () => void;
}
