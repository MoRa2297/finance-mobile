export type BankAccount = {
  id: number;
  name: string;
  startingBalance: number;
  userId: number;
  colorId: number;
  bankTypeId: number;
  bankAccountTypeId: number;
};

export type EditBankAccount = {
  id?: number;
  name: string;
  startingBalance: number;
  userId: number | string;
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
