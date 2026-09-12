import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { persistentStorage } from '@/lib/storage';
import { CartItem } from '@/store/useCartStore';
import { supabase } from '@/lib/supabase';

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
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  syncFromSupabase: () => Promise<void>;
  clearOrders: () => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: async (orderData) => {
        const { data, error } = await supabase
          .from('orders')
          .insert({
            customer_name: orderData.customerName,
            customer_phone: orderData.customerPhone,
            customer_address: orderData.customerAddress || null,
            fulfillment: orderData.fulfillment,
            payment_method: orderData.paymentMethod,
            payment_ref: orderData.paymentRef,
            subtotal: orderData.subtotal,
            tax: orderData.tax,
            delivery_fee: orderData.deliveryFee,
            total: orderData.total,
            items_json: JSON.stringify(orderData.items),
            status: 'pending',
          })
          .select()
          .single();

        if (error) throw error;

        const order: Order = {
          ...orderData,
          id: data.id,
          createdAt: data.created_at,
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

      syncFromSupabase: async () => {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error || !data) return;

        const orders: Order[] = data.map((row: any) => ({
          id: row.id,
          items: typeof row.items_json === 'string' ? JSON.parse(row.items_json) : row.items_json,
          subtotal: Number(row.subtotal),
          tax: Number(row.tax),
          deliveryFee: Number(row.delivery_fee),
          total: Number(row.total),
          customerName: row.customer_name,
          customerPhone: row.customer_phone,
          customerAddress: row.customer_address || '',
          fulfillment: row.fulfillment,
          paymentMethod: row.payment_method,
          paymentRef: row.payment_ref || '',
          status: row.status,
          createdAt: row.created_at,
        }));
        set({ orders });
      },

      clearOrders: () => set({ orders: [] }),
    }),
    { name: 'krust-orders', storage: createJSONStorage(() => persistentStorage) },
  ),
);
