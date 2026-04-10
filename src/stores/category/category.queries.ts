import { useQuery } from '@tanstack/react-query';
import categoryService from '@/services/category.service';
import { categoryKeys } from './category.keys';
import { TransactionFormTypes } from '@/types';

export const useCategories = (type?: TransactionFormTypes) => {
  return useQuery({
    queryKey: categoryKeys.listByType(type),
    queryFn: () => categoryService.getCategories(),
    select: data =>
      type ? data.filter(c => c.type === type || c.type === 'BOTH') : data,
  });
};
