import { Color } from './General';

export type BankAccount = {
  id: number;
  name: string;
  startingBalance: number;
  userId: number;
  colorId: number;
  bankTypeId: number;
  bankAccountTypeId: number;
  bankType: BankType | null;
  bankAccountType: BankAccountType | null;
  color: Color | null;
};

export type EditBankAccount = {
  id?: number;
  name: string;
  startingBalance: number;
  colorId: number | string;
  bankTypeId: number | string;
  bankAccountTypeId: number;
};

export type BankType = {
  id: number;
  name: string;
  imageUrl: string;
};

export type BankAccountType = {
  id: number;
  name: string;
};
