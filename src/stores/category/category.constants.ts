import { CategoryState } from './category.types';

export const CATEGORY_INITIAL_STATE: Pick<
  CategoryState,
  'categories' | 'isLoading' | 'isMutating' | 'error'
> = {
  categories: [],
  isLoading: false,
  isMutating: false,
  error: null,
};
