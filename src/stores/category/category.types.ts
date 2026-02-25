import { Category, EditCategory } from '@/types';

export interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;

  fetchCategories: () => Promise<void>;
  createCategory: (payload: EditCategory) => Promise<void>;
  updateCategory: (id: number, payload: EditCategory) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  reset: () => void;
}
