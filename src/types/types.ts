export type Theme = 'light' | 'dark';

export enum TransactionFormTypes {
  INCOME = 'income',
  EXPENSE = 'expense',
  CARD_SPENDING = 'card_spending',
}

export type SettingsList = {
  value: string;
  rows: SettingsListItem[];
};

export type SettingsListItem = {
  title: string;
  iconName: string;
  navigationScreen?: string;
  color?: string;
  callback?: any;
};

export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  surname: string;
  birthDate: Date;
  sex: string;
  imageUrl: string;
  acceptedTerms: boolean;
  token: string;
  updateDate: Date;
  createdDate: Date;
};

export type Category = {
  id: number;
  name: string;
  colorId: string;
  iconId: string;
  userId: number;
  type: 'income' | 'expenses';
  categoryIcon: CategoryIcon;
  categoryColor: Color;
  updateDate?: Date;
  createdDate?: Date;
};

export type EditCategory = {
  id?: number;
  name: string;
  colorId: number | string;
  iconId: number | string;
  type: 'income' | 'expenses';
  userId: number;
  updateDate?: Date;
  createdDate?: Date;
};

export type GenericType = {
  id: number;
  name: string;
};

export type BankAccountType = {
  id: number;
  name: string;
};

export type CardType = {
  id: number;
  name: string;
  imageUrl: string;
};

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

export type Color = {
  id: number;
  hexCode: string;
  updateDate?: Date;
  createdDate?: Date;
  createdBy?: User;
};

export type CategoryIcon = {
  id: number;
  iconName: string;
  updateDate?: Date;
  createdDate?: Date;
};

//** API Response TYPE */

export type SignInResponse = {
  token: string;
  user: User;
};

export type LogInResponse = {
  token: string;
  user: User;
};

export type BankType = {
  id: number;
  name: string;
  imageUrl: string;
};

export type Transaction = {
  id: number;
  bankAccountId: number;
  categoryId: number;
  cardId: number;
  userId: number;
  money: string;
  recived: boolean;
  date: string;
  description: string;
  recurrent: boolean;
  repeat: boolean;
  note: string;
  type: 'income' | 'expense' | 'card_spending';
};

export type EditTransaction = {
  id?: number;
  bankAccountId: number | string;
  cardAccountId: number | string | null;
  categoryId: number | string;
  userId: number | string;
  money: number | string;
  recived: boolean;
  date: string;
  description: string;
  recurrent: boolean;
  repeat: boolean;
  note: string;
  type: 'income' | 'expense' | 'card_spending';
};

export type SwipePickerMonth = {
  id: number;
  date: Date;
  month: string;
  year: number;
};
