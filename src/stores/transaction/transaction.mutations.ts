// stores/transaction/transaction.mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import transactionService from '@/services/transaction.service';
import { transactionKeys } from './transaction.keys';
import {
  CreateTransactionPayload,
  CreateTransferPayload,
  UpdateTransactionPayload,
  Transaction,
} from '@/types';
import { TransactionListResponse } from '@/services/transaction.service';

// ─── useCreateTransaction ──────────────────────────────────────────────────────

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: transactionKeys.mutations.create(),
    mutationFn: (payload: CreateTransactionPayload) =>
      transactionService.createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
};

// ─── useCreateTransfer ─────────────────────────────────────────────────────────

export const useCreateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: transactionKeys.mutations.createTransfer(),
    mutationFn: (payload: CreateTransferPayload) =>
      transactionService.createTransfer(payload),
    onSuccess: () => {
      // A transfer creates two transactions server-side — local cache update
      // is not reliable here, so a targeted refetch is the correct approach
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
};

// ─── useUpdateTransaction ──────────────────────────────────────────────────────

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: transactionKeys.mutations.update(),
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateTransactionPayload;
    }) => transactionService.updateTransaction(id, payload),
    onSuccess: updatedTransaction => {
      // Replace the updated transaction in all cached lists
      queryClient.setQueriesData<TransactionListResponse>(
        { queryKey: transactionKeys.lists() },
        old => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map(t =>
              t.id === updatedTransaction.id ? updatedTransaction : t,
            ),
          };
        },
      );
      // Also sync the detail cache entry if present
      queryClient.setQueryData<Transaction>(
        transactionKeys.detail(updatedTransaction.id),
        updatedTransaction,
      );
    },
  });
};

// ─── useUpdateTransfer ─────────────────────────────────────────────────────────

export const useUpdateTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: transactionKeys.mutations.updateTransfer(),
    mutationFn: ({
      transferDetailId,
      payload,
    }: {
      transferDetailId: number;
      payload: CreateTransferPayload;
    }) => transactionService.updateTransfer(transferDetailId, payload),
    onSuccess: () => {
      // Both legs are recreated server-side — invalidate all lists
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
};

// ─── useDeleteTransaction ──────────────────────────────────────────────────────

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: transactionKeys.mutations.delete(),
    mutationFn: (id: number) => transactionService.deleteTransaction(id),
    onSuccess: (_, deletedId) => {
      // Remove the deleted transaction from all cached lists
      queryClient.setQueriesData<TransactionListResponse>(
        { queryKey: transactionKeys.lists() },
        old => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter(t => t.id !== deletedId),
          };
        },
      );
      // Drop the detail cache entry entirely
      queryClient.removeQueries({
        queryKey: transactionKeys.detail(deletedId),
      });
    },
  });
};

// ─── useDeleteTransfer ─────────────────────────────────────────────────────────

export const useDeleteTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: transactionKeys.mutations.deleteTransfer(),
    mutationFn: (transferDetailId: number) =>
      transactionService.deleteTransfer(transferDetailId),
    onSuccess: () => {
      // Both legs are gone — invalidate all lists
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
};
