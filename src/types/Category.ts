import { Color } from './General';

export type CategoryType = 'INCOME' | 'EXPENSE';

export type Category = {
  id: number;
  name: string;
  colorId: string;
  iconId: string;
  userId: number;
  type: CategoryType;
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
  type: CategoryType;
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
