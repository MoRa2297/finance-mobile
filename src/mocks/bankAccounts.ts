import { BankAccount, BankType, BankAccountType } from '@/types';

export const MOCK_BANK_TYPES: BankType[] = [
  {
    id: 1,
    name: 'Unicredit',
    imageUrl:
      'https://ui-avatars.com/api/?name=UC&background=E50914&color=fff&size=80&bold=true',
  },
  {
    id: 2,
    name: 'Intesa Sanpaolo',
    imageUrl:
      'https://ui-avatars.com/api/?name=IS&background=006341&color=fff&size=80&bold=true',
  },
  {
    id: 3,
    name: 'BNL',
    imageUrl:
      'https://ui-avatars.com/api/?name=BNL&background=00A859&color=fff&size=80&bold=true',
  },
  {
    id: 4,
    name: 'Fineco',
    imageUrl:
      'https://ui-avatars.com/api/?name=F&background=004B93&color=fff&size=80&bold=true',
  },
  {
    id: 5,
    name: 'ING',
    imageUrl:
      'https://ui-avatars.com/api/?name=ING&background=FF6600&color=fff&size=80&bold=true',
  },
  {
    id: 6,
    name: 'N26',
    imageUrl:
      'https://ui-avatars.com/api/?name=N26&background=36A18B&color=fff&size=80&bold=true',
  },
  {
    id: 7,
    name: 'Revolut',
    imageUrl:
      'https://ui-avatars.com/api/?name=R&background=0075EB&color=fff&size=80&bold=true',
  },
  {
    id: 8,
    name: 'Mediolanum',
    imageUrl:
      'https://ui-avatars.com/api/?name=M&background=003366&color=fff&size=80&bold=true',
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
