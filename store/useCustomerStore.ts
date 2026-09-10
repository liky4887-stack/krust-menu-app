import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { persistentStorage } from '@/lib/storage';

export interface CustomerProfile {
  name: string;
  phone: string;
  address: string;
}

interface CustomerState {
  profile: CustomerProfile | null;
  setProfile: (profile: CustomerProfile) => void;
  updateProfile: (partial: Partial<CustomerProfile>) => void;
  clearProfile: () => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updateProfile: (partial) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...partial }
            : { name: '', phone: '', address: '', ...partial },
        })),
      clearProfile: () => set({ profile: null }),
    }),
    { name: 'krust-customer', storage: createJSONStorage(() => persistentStorage) },
  ),
);
