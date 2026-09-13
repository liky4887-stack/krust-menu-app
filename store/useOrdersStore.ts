import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { persistentStorage } from '@/lib/storage';
import { CartItem } from '@/store/useCartStore';

export type FulfillmentType = 'pickup' | 'delivery';
export type PaymentMethod = 'sedad' | 'edfaely' | 'cash';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
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
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  clearOrders: () => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (orderData) => {
        const order: Order = {
          ...orderData,
          id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: new Date().toISOString(),
          status: 'pending',
        };
        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status } : o
          ),
        })),

      clearOrders: () => set({ orders: [] }),
    }),
    { name: 'krust-orders', storage: createJSONStorage(() => persistentStorage) },
  ),
);
