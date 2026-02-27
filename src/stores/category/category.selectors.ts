import { CategoryState } from './category.types';

export const categorySelectors = {
  categories: (state: CategoryState) => state.categories,
  isLoading: (state: CategoryState) => state.isLoading,
  isMutating: (state: CategoryState) => state.isMutating,
  error: (state: CategoryState) => state.error,
};
