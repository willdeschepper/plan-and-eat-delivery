import { create } from 'zustand';

type OrdersState = {
  pickedUpByCompany: Record<string, number>;
  setPickedUpQuantity: (stopId: string, companyId: string, quantity: number) => void;
  markDelivered: (stopId: string) => void;
  completedCount: () => number;
};

export const useOrdersStore = create<OrdersState>((set, get) => ({
  pickedUpByCompany: {},

  setPickedUpQuantity: (stopId, companyId, quantity) => {
    const key = `${stopId}:${companyId}`;
    set(state => ({
      pickedUpByCompany: {
        ...state.pickedUpByCompany,
        [key]: Math.max(0, quantity),
      },
    }));
  },

  markDelivered: (stopId) => {
    set((state) => {
      const deliveredKey = `delivered:${stopId}`;
      if (state.pickedUpByCompany[deliveredKey]) {
        return state;
      }

      return {
        pickedUpByCompany: {
          ...state.pickedUpByCompany,
          [deliveredKey]: 1,
        },
      };
    });
  },

  completedCount: () =>
    Object.keys(get().pickedUpByCompany).filter(key => key.startsWith('delivered:')).length,
}));
