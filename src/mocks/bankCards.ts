import { BankCard, CardType } from '@/types';

export const MOCK_CARD_TYPES: CardType[] = [
  {
    id: 1,
    name: 'Visa',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png',
  },
  {
    id: 2,
    name: 'Mastercard',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png',
  },
  {
    id: 3,
    name: 'American Express',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/200px-American_Express_logo_%282018%29.svg.png',
  },
  {
    id: 4,
    name: 'Maestro',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Maestro_2016.svg/200px-Maestro_2016.svg.png',
  },
];

export const MOCK_BANK_CARDS: BankCard[] = [
  {
    id: 1,
    bankAccountId: 1,
    name: 'Main Debit Card',
    cardTypeId: 1, // Visa
    cardLimit: '5000',
    monthExpiry: 12,
    yearExpiry: 2026,
  },
  {
    id: 2,
    bankAccountId: 1,
    name: 'Travel Card',
    cardTypeId: 2, // Mastercard
    cardLimit: '3000',
    monthExpiry: 6,
    yearExpiry: 2025,
  },
  {
    id: 3,
    bankAccountId: 2,
    name: 'Business Card',
    cardTypeId: 3, // Amex
    cardLimit: '10000',
    monthExpiry: 9,
    yearExpiry: 2027,
  },
  {
    id: 4,
    bankAccountId: 3,
    name: 'Savings Debit',
    cardTypeId: 4, // Maestro
    cardLimit: '2000',
    monthExpiry: 3,
    yearExpiry: 2026,
  },
];
