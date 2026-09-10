import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { persistentStorage } from '@/lib/storage';
import { CartItem } from '@/store/useCartStore';

export type FulfillmentType = 'pickup' | 'delivery';
export type PaymentMethod = 'sedad' | 'edfaely' | 'cash';
export type OrderStatus = 'completed';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  fulfillment: FulfillmentType;
  paymentMethod: PaymentMethod;
  paymentRef: string;
  status: OrderStatus;
  createdAt: string;
}

interface OrdersState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  clearOrders: () => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (orderData) => {
        const order: Order = {
          ...orderData,
          id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          createdAt: new Date().toISOString(),
          status: 'completed',
        };
        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },
      clearOrders: () => set({ orders: [] }),
    }),
    { name: 'krust-orders', storage: createJSONStorage(() => persistentStorage) },
  ),
);
