import { BankAccount, BankCard } from '@/types/types';

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 1,
    name: 'Conto Principale',
    startingBalance: 5000,
    userId: 1,
    colorId: 1,
    bankTypeId: 1,
    bankAccountTypeId: 1,
  },
  {
    id: 2,
    name: 'Conto Risparmio',
    startingBalance: 10000,
    userId: 1,
    colorId: 2,
    bankTypeId: 1,
    bankAccountTypeId: 2,
  },
];

export const MOCK_BANK_CARDS: BankCard[] = [
  {
    id: 1,
    name: 'Visa Gold',
    bankAccountId: 1,
    cardTypeId: 1,
    cardLimit: '5000',
    monthExpiry: 12,
    yearExpiry: 2027,
  },
  {
    id: 2,
    name: 'Mastercard',
    bankAccountId: 1,
    cardTypeId: 2,
    cardLimit: '3000',
    monthExpiry: 6,
    yearExpiry: 2026,
  },
];
