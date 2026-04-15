import { useMutation, useQueryClient } from '@tanstack/react-query';
import cardService from '@/services/card.service';
import { cardKeys } from './card.keys';
import { transactionKeys } from '@/stores/transaction/transaction.keys';
import { BankCard, EditBankCard } from '@/types';

// ─── useCreateCard ─────────────────────────────────────────────────────────────

export const useCreateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: cardKeys.mutations.create(),
    mutationFn: (payload: EditBankCard) => cardService.createCard(payload),
    onSuccess: newCard => {
      queryClient.setQueryData<BankCard[]>(cardKeys.lists(), old =>
        old ? [newCard, ...old] : [newCard],
      );
    },
  });
};

// ─── useUpdateCard ─────────────────────────────────────────────────────────────

export const useUpdateCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: cardKeys.mutations.update(),
    mutationFn: ({ id, payload }: { id: number; payload: EditBankCard }) =>
      cardService.updateCard(id, payload),
    onSuccess: updatedCard => {
      queryClient.setQueryData<BankCard[]>(cardKeys.lists(), old =>
        old
          ? old.map(c => (c.id === updatedCard.id ? updatedCard : c))
          : [updatedCard],
      );
      queryClient.setQueryData<BankCard>(
        cardKeys.detail(updatedCard.id),
        updatedCard,
      );
    },
  });
};

// ─── useDeleteCard ─────────────────────────────────────────────────────────────

export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: cardKeys.mutations.delete(),
    mutationFn: (id: number) => cardService.deleteCard(id),
    onSuccess: (_, deletedId) => {
      // Remove from list cache
      queryClient.setQueryData<BankCard[]>(cardKeys.lists(), old =>
        old ? old.filter(c => c.id !== deletedId) : [],
      );
      // Drop detail cache
      queryClient.removeQueries({
        queryKey: cardKeys.detail(deletedId),
      });
      // Invalidate transactions — they may reference this card
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
};
