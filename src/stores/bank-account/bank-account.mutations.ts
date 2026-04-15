import { useMutation, useQueryClient } from '@tanstack/react-query';
import bankAccountService from '@/services/bank-account.service';
import { bankAccountKeys } from './bank-account.keys';
import { transactionKeys } from '@/stores/transaction/transaction.keys';
import { BankAccount, EditBankAccount } from '@/types';

// ─── useCreateBankAccount ──────────────────────────────────────────────────────

export const useCreateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: bankAccountKeys.mutations.create(),
    mutationFn: (payload: EditBankAccount) =>
      bankAccountService.createBankAccount(payload),
    onSuccess: newAccount => {
      // Prepend to cached list
      queryClient.setQueryData<BankAccount[]>(bankAccountKeys.lists(), old =>
        old ? [newAccount, ...old] : [newAccount],
      );
    },
  });
};

// ─── useUpdateBankAccount ──────────────────────────────────────────────────────

export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: bankAccountKeys.mutations.update(),
    mutationFn: ({ id, payload }: { id: number; payload: EditBankAccount }) =>
      bankAccountService.updateBankAccount(id, payload),
    onSuccess: updatedAccount => {
      // Update list cache
      queryClient.setQueryData<BankAccount[]>(bankAccountKeys.lists(), old =>
        old
          ? old.map(a => (a.id === updatedAccount.id ? updatedAccount : a))
          : [updatedAccount],
      );
      // Update detail cache
      queryClient.setQueryData<BankAccount>(
        bankAccountKeys.detail(updatedAccount.id),
        updatedAccount,
      );
    },
  });
};

// ─── useDeleteBankAccount ──────────────────────────────────────────────────────

export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: bankAccountKeys.mutations.delete(),
    mutationFn: (id: number) => bankAccountService.deleteBankAccount(id),
    onSuccess: (_, deletedId) => {
      // Remove from list cache
      queryClient.setQueryData<BankAccount[]>(bankAccountKeys.lists(), old =>
        old ? old.filter(a => a.id !== deletedId) : [],
      );
      // Drop detail cache
      queryClient.removeQueries({
        queryKey: bankAccountKeys.detail(deletedId),
      });
      // Invalidate transactions — they may reference this account
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
};
