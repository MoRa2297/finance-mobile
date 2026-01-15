import { User } from '@/stores';

export type GenericType = {
  id: number;
  name: string;
};

export type Color = {
  id: number;
  hexCode: string;
  updateDate?: Date;
  createdDate?: Date;
  createdBy?: User;
};

export type SignInResponse = {
  token: string;
  user: User;
};

export type LogInResponse = {
  token: string;
  user: User;
};

export type SwipePickerMonth = {
  id: number;
  date: Date;
  month: string;
  year: number;
};
