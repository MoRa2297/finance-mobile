import { BankAccount, BankType, BankAccountType } from '@/types';

export const MOCK_BANK_TYPES: BankType[] = [
  {
    id: 1,
    name: 'Unicredit',
    imageUrl: 'https://logo.clearbit.com/unicredit.it',
  },
  {
    id: 2,
    name: 'Intesa Sanpaolo',
    imageUrl: 'https://logo.clearbit.com/intesasanpaolo.com',
  },
  { id: 3, name: 'BNL', imageUrl: 'https://logo.clearbit.com/bnl.it' },
  { id: 4, name: 'Fineco', imageUrl: 'https://logo.clearbit.com/fineco.it' },
  { id: 5, name: 'ING', imageUrl: 'https://logo.clearbit.com/ing.com' },
  { id: 6, name: 'N26', imageUrl: 'https://logo.clearbit.com/n26.com' },
  { id: 7, name: 'Revolut', imageUrl: 'https://logo.clearbit.com/revolut.com' },
  {
    id: 8,
    name: 'Mediolanum',
    imageUrl: 'https://logo.clearbit.com/mediolanum.it',
  },
];

export const MOCK_BANK_ACCOUNT_TYPES: BankAccountType[] = [
  { id: 1, name: 'checking' },
  { id: 2, name: 'savings' },
  { id: 3, name: 'investment' },
];

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
    colorId: 5,
    bankTypeId: 4,
    bankAccountTypeId: 2,
  },
  {
    id: 3,
    name: 'Conto N26',
    startingBalance: 500,
    userId: 1,
    colorId: 19,
    bankTypeId: 6,
    bankAccountTypeId: 1,
  },
];
