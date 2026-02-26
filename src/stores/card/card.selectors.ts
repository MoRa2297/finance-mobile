import { CardState } from './card.types';

export const cardSelectors = {
  cards: (state: CardState) => state.cards,
  isLoading: (state: CardState) => state.isLoading,
  isMutating: (state: CardState) => state.isMutating,
  error: (state: CardState) => state.error,
};
