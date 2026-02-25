import { Color } from './General';

export type Category = {
  id: number;
  name: string;
  colorId: string;
  iconId: string;
  userId: number;
  type: 'income' | 'expense';
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
  type: 'income' | 'expense';
  // userId: number;
  updateDate?: Date;
  createdDate?: Date;
};

export type CategoryIcon = {
  id: number;
  iconName: string;
  updateDate?: Date;
  createdDate?: Date;
};
