import { create } from 'zustand';
import { cardService } from '@/services';
import { CardState } from './card.types';
import { CARD_INITIAL_STATE } from './card.constants';
import { EditBankCard } from '@/types';

export const useCardStore = create<CardState>()(set => ({
  ...CARD_INITIAL_STATE,

  fetchCards: async () => {
    set({ isLoading: true, error: null });
    const cards = await cardService.getCards();
    set({ cards, isLoading: false });
  },

  createCard: async (payload: EditBankCard) => {
    set({ isMutating: true, error: null });
    const card = await cardService.createCard(payload);
    set(state => ({ cards: [...state.cards, card], isMutating: false }));
  },

  updateCard: async (id: number, payload: EditBankCard) => {
    set({ isMutating: true, error: null });
    const updated = await cardService.updateCard(id, payload);
    set(state => ({
      cards: state.cards.map(c => (c.id === id ? updated : c)),
      isMutating: false,
    }));
  },

  deleteCard: async (id: number) => {
    set({ isMutating: true, error: null });
    await cardService.deleteCard(id);
    set(state => ({
      cards: state.cards.filter(c => c.id !== id),
      isMutating: false,
    }));
  },

  reset: () => set(CARD_INITIAL_STATE),
}));
