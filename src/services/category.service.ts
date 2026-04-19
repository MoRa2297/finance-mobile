import apiClient from './api-client';
import { Category, EditCategory } from '@/types';

const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<Category[]>('/categories');
    return data;
  },

  getCategory: async (id: number): Promise<Category> => {
    const { data } = await apiClient.get<Category>(`/categories/${id}`);
    return data;
  },

  createCategory: async (payload: EditCategory): Promise<Category> => {
    const response = await apiClient.post<Category>('/categories', payload);
    return response.data;
  },

  updateCategory: async (
    id: number,
    payload: EditCategory,
  ): Promise<Category> => {
    const { data } = await apiClient.put<Category>(
      `/categories/${id}`,
      payload,
    );
    return data;
  },

  deleteCategory: async (id: number): Promise<{ message: string }> => {
    const { data } = await apiClient.delete<{ message: string }>(
      `/categories/${id}`,
    );
    return data;
  },
};

export default categoryService;
