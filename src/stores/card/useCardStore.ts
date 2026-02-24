import { create } from 'zustand';
import { cardService } from '@/services';
import { CardState } from './card.types';
import { CARD_INITIAL_STATE } from './card.constants';
import { EditBankCard } from '@/types';

export const useCardStore = create<CardState>()(set => ({
  ...CARD_INITIAL_STATE,

  fetchCards: async () => {
    set({ isLoading: true, error: null });
    try {
      const cards = await cardService.getCards();
      set({ cards, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load cards';
      set({ isLoading: false, error: message });
    }
  },

  createCard: async (payload: EditBankCard) => {
    set({ isLoading: true, error: null });
    try {
      const card = await cardService.createCard(payload);
      set(state => ({ cards: [...state.cards, card], isLoading: false }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to create card';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  updateCard: async (id: number, payload: EditBankCard) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await cardService.updateCard(id, payload);
      set(state => ({
        cards: state.cards.map(c => (c.id === id ? updated : c)),
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to update card';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  deleteCard: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await cardService.deleteCard(id);
      set(state => ({
        cards: state.cards.filter(c => c.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to delete card';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  reset: () => set(CARD_INITIAL_STATE),
}));
