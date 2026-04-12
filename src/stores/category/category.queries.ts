import { useQuery } from '@tanstack/react-query';
import categoryService from '@/services/category.service';
import { categoryKeys } from './category.keys';
import { TransactionFormTypes } from '@/types';

export const useCategories = (type?: TransactionFormTypes) => {
  return useQuery({
    queryKey: categoryKeys.listByType(type),
    queryFn: () => categoryService.getCategories(),
    select: data => {
      if (!type) return data;
      // INCOME categories → solo per income
      // EXPENSE categories → solo per expense
      // Transfer non ha categorie proprie — non filtrare
      if (type === TransactionFormTypes.INCOME) {
        return data.filter(c => c.type === 'INCOME');
      }
      if (type === TransactionFormTypes.EXPENSE) {
        return data.filter(c => c.type === 'EXPENSE');
      }
      return data;
    },
  });
};
