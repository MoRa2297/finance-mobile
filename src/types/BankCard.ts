export type BankCard = {
  id: number;
  bankAccountId: number;
  name: string;
  cardTypeId: number;
  cardLimit: string;
  monthExpiry: number;
  yearExpiry: number;
};

export type EditBankCard = {
  id?: number;
  bankAccountId: number | string;
  name: string;
  cardTypeId: number;
  cardLimit: number | string;
  monthExpiry: number;
  yearExpiry: number;
  userId: number;
};

export type CardType = {
  id: number;
  name: string;
  imageUrl: string;
};
