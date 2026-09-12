import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { persistentStorage } from '@/lib/storage';

export interface CartItem {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  quantity: number;
  image: string;
  options?: string;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string, options?: string) => void;
  increment: (id: string, options?: string) => void;
  decrement: (id: string, options?: string) => void;
  getTotal: () => number;
  getItemCount: () => number;
  clearCart: () => void;
}

const matchItem = (i: CartItem, id: string, options?: string) =>
  i.id === id && i.options === options;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => matchItem(i, item.id, item.options)
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                matchItem(i, item.id, item.options)
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),

      removeItem: (id, options) =>
        set((state) => ({
          items: state.items.filter((i) => !matchItem(i, id, options)),
        })),

      increment: (id, options) =>
        set((state) => ({
          items: state.items.map((i) =>
            matchItem(i, id, options) ? { ...i, quantity: i.quantity + 1 } : i
          ),
        })),

      decrement: (id, options) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              matchItem(i, id, options) ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      getTotal: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'krust-cart', storage: createJSONStorage(() => persistentStorage) },
  ),
);
