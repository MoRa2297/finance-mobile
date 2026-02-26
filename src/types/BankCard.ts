import { BankAccount } from './BankAccount';

export type BankCard = {
  id: number;
  name: string;
  cardLimit: number;
  monthExpiry: number;
  yearExpiry: number;
  userId: number;
  bankAccountId: number | null;
  cardTypeId: number | null;
  cardType: CardType | null;
  bankAccount: BankAccount | null;
};

export type EditBankCard = {
  name: string;
  cardLimit: number;
  monthExpiry: number;
  yearExpiry: number;
  bankAccountId?: number;
  cardTypeId?: number;
};

export type CardType = {
  id: number;
  name: string;
  imageUrl: string;
};
