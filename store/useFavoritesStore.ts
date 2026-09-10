import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { persistentStorage } from '@/lib/storage';

interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((x) => x !== id)
            : [...state.ids, id],
        })),
      isFavorite: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: 'krust-favorites', storage: createJSONStorage(() => persistentStorage) },
  ),
);
