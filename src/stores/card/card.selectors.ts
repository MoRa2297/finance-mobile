import { CardState } from './card.types';

export const cardSelectors = {
  cards: (state: CardState) => state.cards,
  isLoading: (state: CardState) => state.isLoading,
  error: (state: CardState) => state.error,
};
