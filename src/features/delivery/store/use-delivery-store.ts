import { create } from 'zustand';

type DeliveryStore = {
  initialized: boolean;
  setInitialized: (value: boolean) => void;
};

export const useDeliveryStore = create<DeliveryStore>(set => ({
  initialized: false,
  setInitialized: value => set({ initialized: value }),
}));
