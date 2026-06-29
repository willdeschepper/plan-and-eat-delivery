import { create } from 'zustand';

import { MOCK_PROFILE } from '../mock-data';
import type { CourierProfile } from '../types';

type OrdersState = {
  profile: CourierProfile;
  pickedUpByCompany: Record<string, number>;
  setPickedUpQuantity: (stopId: string, companyId: string, quantity: number) => void;
  markDelivered: (stopId: string) => void;
  completedCount: () => number;
};

export const useOrdersStore = create<OrdersState>((set, get) => ({
  profile: MOCK_PROFILE,
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
    set(state => {
      const deliveredKey = `delivered:${stopId}`;
      if (state.pickedUpByCompany[deliveredKey]) {
        return state;
      }

      return {
        pickedUpByCompany: {
          ...state.pickedUpByCompany,
          [deliveredKey]: 1,
        },
        profile: {
          ...state.profile,
          completedOrdersToday: state.profile.completedOrdersToday + 1,
          totalEarnings: state.profile.totalEarnings + 8.5,
        },
      };
    });
  },

  completedCount: () => {
    const { profile, pickedUpByCompany } = get();
    const deliveredFromLocal = Object.keys(pickedUpByCompany).filter(
      key => key.startsWith('delivered:'),
    ).length;

    return Math.max(profile.completedOrdersToday, deliveredFromLocal);
  },
}));
