import { CategoryState } from './category.types';

export const CATEGORY_INITIAL_STATE: Pick<
  CategoryState,
  'categories' | 'isLoading' | 'error'
> = {
  categories: [],
  isLoading: false,
  error: null,
};
