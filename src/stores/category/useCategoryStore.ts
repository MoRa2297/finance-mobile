import { create } from 'zustand';
import { categoryService } from '@/services';
import { CategoryState } from './category.types';
import { CATEGORY_INITIAL_STATE } from './category.constants';
import { EditCategory } from '@/types';

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  ...CATEGORY_INITIAL_STATE,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await categoryService.getCategories();
      set({ categories, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load categories';
      set({ isLoading: false, error: message });
    }
  },

  createCategory: async (payload: EditCategory) => {
    set({ isMutating: true, error: null });
    try {
      const category = await categoryService.createCategory(payload);
      set(state => ({
        categories: [...state.categories, category],
        isMutating: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create category';
      set({ isMutating: false, error: message });
      throw error;
    }
  },

  updateCategory: async (id: number, payload: EditCategory) => {
    set({ isMutating: true, error: null });
    try {
      const updated = await categoryService.updateCategory(id, payload);
      set(state => ({
        categories: state.categories.map(c => (c.id === id ? updated : c)),
        isMutating: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update category';
      set({ isMutating: false, error: message });
      throw error;
    }
  },

  deleteCategory: async (id: number) => {
    set({ isMutating: true, error: null });
    try {
      await categoryService.deleteCategory(id);
      set(state => ({
        categories: state.categories.filter(c => c.id !== id),
        isMutating: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete category';
      set({ isMutating: false, error: message });
      throw error;
    }
  },

  reset: () => set(CATEGORY_INITIAL_STATE),
}));
