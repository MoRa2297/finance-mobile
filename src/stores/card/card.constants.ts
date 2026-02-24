import { CardState } from './card.types';

export const CARD_INITIAL_STATE: Pick<
  CardState,
  'cards' | 'isLoading' | 'error'
> = {
  cards: [],
  isLoading: false,
  error: null,
};
