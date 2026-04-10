import { useQuery } from '@tanstack/react-query';
import cardService from '@/services/card.service';
import { cardKeys } from './card.keys';

export const useCards = () => {
  return useQuery({
    queryKey: cardKeys.lists(),
    queryFn: () => cardService.getCards(),
  });
};

export const useCardsByAccount = (bankAccountIds: number[]) => {
  return useQuery({
    queryKey: cardKeys.listByAccounts(bankAccountIds),
    queryFn: () => cardService.getCards(),
    enabled: bankAccountIds.length > 0,
    // Filter client-side — evita un endpoint dedicato
    select: data =>
      data.filter(card => bankAccountIds.includes(card.bankAccountId)),
  });
};
