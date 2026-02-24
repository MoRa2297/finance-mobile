import { CategoryState } from './category.types';

export const categorySelectors = {
  categories: (state: CategoryState) => state.categories,
  isLoading: (state: CategoryState) => state.isLoading,
  error: (state: CategoryState) => state.error,
  expenseCategories: (state: CategoryState) =>
    state.categories.filter(c => c.type === 'expenses'),
  incomeCategories: (state: CategoryState) =>
    state.categories.filter(c => c.type === 'income'),
};
