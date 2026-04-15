import { useQuery } from '@tanstack/react-query';
import bankAccountService from '@/services/bank-account.service';
import { bankAccountKeys } from './bank-account.keys';

export const useBankAccounts = () => {
  return useQuery({
    queryKey: bankAccountKeys.lists(),
    queryFn: ({ signal }) => bankAccountService.getBankAccounts(),
    select: data => data,
  });
};

export const useBankAccount = (id: number | null) => {
  return useQuery({
    queryKey: bankAccountKeys.detail(id!),
    queryFn: ({ signal }) => bankAccountService.getBankAccount(id!),
    enabled: id !== null && id > 0,
  });
};
