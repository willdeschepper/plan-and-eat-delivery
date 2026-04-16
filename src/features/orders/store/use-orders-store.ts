import { create } from 'zustand';

type OrdersStore = {
  initialized: boolean;
  setInitialized: (value: boolean) => void;
};

export const useOrdersStore = create<OrdersStore>(set => ({
  initialized: false,
  setInitialized: value => set({ initialized: value }),
}));
