import dayjs from 'dayjs';
import { Transaction } from '@/types';
import { MOCK_CATEGORIES } from './categories';
import { MOCK_BANK_ACCOUNTS } from './bankAccounts';
import { MOCK_BANK_CARDS } from './bankCards';

const today = dayjs();

const findCategory = (id: number | null) =>
  id ? (MOCK_CATEGORIES.find(c => c.id === id) ?? null) : null;

const findBankAccount = (id: number | null) =>
  id ? (MOCK_BANK_ACCOUNTS.find(a => a.id === id) ?? null) : null;

const findCard = (id: number | null) =>
  id ? (MOCK_BANK_CARDS.find(c => c.id === id) ?? null) : null;

type MockSeed = {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: Transaction['type'];
  recurrent: boolean;
  note: string;
  categoryId: number | null;
  bankAccountId: number | null;
  cardAccountId: number | null;
};

const seeds: MockSeed[] = [
  // Oggi
  {
    id: 1,
    description: 'Spesa Supermercato',
    amount: 85.5,
    date: today.format('YYYY-MM-DD'),
    type: 'EXPENSE',
    recurrent: false,
    note: '',
    categoryId: 1,
    bankAccountId: 1,
    cardAccountId: null,
  },
  {
    id: 2,
    description: 'Caffè e cornetto',
    amount: 3.5,
    date: today.format('YYYY-MM-DD'),
    type: 'EXPENSE',
    recurrent: false,
    note: '',
    categoryId: 8,
    bankAccountId: 1,
    cardAccountId: null,
  },
  // Ieri
  {
    id: 3,
    description: 'Benzina',
    amount: 45,
    date: today.subtract(1, 'day').format('YYYY-MM-DD'),
    type: 'EXPENSE',
    recurrent: false,
    note: '',
    categoryId: 2,
    bankAccountId: 1,
    cardAccountId: null,
  },
  {
    id: 4,
    description: 'Netflix',
    amount: 15.99,
    date: today.subtract(1, 'day').format('YYYY-MM-DD'),
    type: 'EXPENSE',
    recurrent: true,
    note: 'Abbonamento mensile',
    categoryId: 3,
    bankAccountId: null,
    cardAccountId: 1,
  },
  // 3 giorni fa
  {
    id: 5,
    description: 'Stipendio Gennaio',
    amount: 2500,
    date: today.subtract(3, 'day').format('YYYY-MM-DD'),
    type: 'INCOME',
    recurrent: true,
    note: 'Stipendio mensile',
    categoryId: 5,
    bankAccountId: 1,
    cardAccountId: null,
  },
  // 5 giorni fa
  {
    id: 6,
    description: 'Bolletta Luce',
    amount: 120,
    date: today.subtract(5, 'day').format('YYYY-MM-DD'),
    type: 'EXPENSE',
    recurrent: true,
    note: '',
    categoryId: 6,
    bankAccountId: 1,
    cardAccountId: null,
  },
  {
    id: 7,
    description: 'Farmacia',
    amount: 25.8,
    date: today.subtract(5, 'day').format('YYYY-MM-DD'),
    type: 'EXPENSE',
    recurrent: false,
    note: 'Medicinali',
    categoryId: 4,
    bankAccountId: 1,
    cardAccountId: null,
  },
  // Settimana scorsa
  {
    id: 8,
    description: 'Cena fuori',
    amount: 65,
    date: today.subtract(7, 'day').format('YYYY-MM-DD'),
    type: 'EXPENSE',
    recurrent: false,
    note: 'Ristorante giapponese',
    categoryId: 8,
    bankAccountId: null,
    cardAccountId: 2,
  },
  {
    id: 9,
    description: 'Amazon - Libri',
    amount: 35.99,
    date: today.subtract(8, 'day').format('YYYY-MM-DD'),
    type: 'EXPENSE',
    recurrent: false,
    note: '',
    categoryId: 7,
    bankAccountId: null,
    cardAccountId: 1,
  },
  {
    id: 10,
    description: 'Bonus progetto',
    amount: 500,
    date: today.subtract(10, 'day').format('YYYY-MM-DD'),
    type: 'INCOME',
    recurrent: false,
    note: 'Bonus Q4',
    categoryId: 5,
    bankAccountId: 1,
    cardAccountId: null,
  },
  // Due settimane fa
  {
    id: 11,
    description: 'Palestra abbonamento',
    amount: 50,
    date: today.subtract(15, 'day').format('YYYY-MM-DD'),
    type: 'EXPENSE',
    recurrent: true,
    note: 'Abbonamento mensile',
    categoryId: 4,
    bankAccountId: 1,
    cardAccountId: null,
  },
  {
    id: 12,
    description: 'Cinema',
    amount: 12,
    date: today.subtract(15, 'day').format('YYYY-MM-DD'),
    type: 'EXPENSE',
    recurrent: false,
    note: '',
    categoryId: 3,
    bankAccountId: 1,
    cardAccountId: null,
  },
  // Transazione in attesa
  {
    id: 13,
    description: 'Rimborso spese',
    amount: 150,
    date: today.subtract(2, 'day').format('YYYY-MM-DD'),
    type: 'INCOME',
    recurrent: false,
    note: 'In attesa di accredito',
    categoryId: 5,
    bankAccountId: 1,
    cardAccountId: null,
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = seeds.map(seed => ({
  id: seed.id,
  userId: 1,
  bankAccountId: seed.bankAccountId,
  cardAccountId: seed.cardAccountId,
  categoryId: seed.categoryId,
  recurringRuleId: null,
  transferDetailId: null,
  amount: seed.amount,
  date: seed.date,
  description: seed.description,
  recurrent: seed.recurrent,
  note: seed.note,
  type: seed.type,
  category: findCategory(seed.categoryId),
  bankAccount: findBankAccount(seed.bankAccountId),
  card: findCard(seed.cardAccountId),
  transferDetail: null,
  recurringRule: null,
}));
