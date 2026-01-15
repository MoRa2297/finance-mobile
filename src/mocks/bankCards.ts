import { BankCard, CardType } from '@/types';

export const MOCK_CARD_TYPES: CardType[] = [
  { id: 1, name: 'Visa', imageUrl: 'https://logo.clearbit.com/visa.com' },
  {
    id: 2,
    name: 'Mastercard',
    imageUrl: 'https://logo.clearbit.com/mastercard.com',
  },
  {
    id: 3,
    name: 'American Express',
    imageUrl: 'https://logo.clearbit.com/americanexpress.com',
  },
  { id: 4, name: 'Maestro', imageUrl: 'https://logo.clearbit.com/maestro.com' },
];

export const MOCK_BANK_CARDS: BankCard[] = [
  {
    id: 1,
    bankAccountId: 1,
    name: 'Carta Principale',
    cardTypeId: 1,
    cardLimit: '1500',
    monthExpiry: 12,
    yearExpiry: 2027,
  },
  {
    id: 2,
    bankAccountId: 2,
    name: 'Carta Business',
    cardTypeId: 2,
    cardLimit: '3000',
    monthExpiry: 6,
    yearExpiry: 2026,
  },
];
