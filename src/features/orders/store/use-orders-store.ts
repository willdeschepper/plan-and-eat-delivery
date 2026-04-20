import { create } from 'zustand';

import { MOCK_PROFILE, MOCK_STOPS } from '../mock-data';
import type { CourierProfile, DeliveryStop } from '../types';

type OrdersState = {
  stops: DeliveryStop[];
  profile: CourierProfile;
  setPickedUpQuantity: (stopId: string, companyId: string, quantity: number) => void;
  markDelivered: (stopId: string) => void;
  isStopLocked: (stopId: string) => boolean;
  isStopCompleted: (stopId: string) => boolean;
  completedCount: () => number;
};

export const useOrdersStore = create<OrdersState>((set, get) => ({
  stops: MOCK_STOPS,
  profile: MOCK_PROFILE,

  setPickedUpQuantity: (stopId, companyId, quantity) => {
    set(state => ({
      stops: state.stops.map(stop => {
        if (stop.id !== stopId) return stop;
        return {
          ...stop,
          companies: stop.companies.map(company => {
            if (company.id !== companyId) return company;
            return { ...company, pickedUpQuantity: Math.max(0, quantity) };
          }),
        };
      }),
    }));
  },

  markDelivered: (stopId) => {
    set(state => {
      const wasDelivered = state.stops.find(s => s.id === stopId)?.isDelivered ?? false;
      if (wasDelivered) return state;

      return {
        stops: state.stops.map(stop =>
          stop.id === stopId ? { ...stop, isDelivered: true } : stop,
        ),
        profile: {
          ...state.profile,
          completedOrdersToday: state.profile.completedOrdersToday + 1,
          totalEarnings: state.profile.totalEarnings + 8.5,
        },
      };
    });
  },

  isStopLocked: (stopId) => {
    const { stops } = get();
    const idx = stops.findIndex(s => s.id === stopId);
    if (idx <= 0) return false;
    return !stops[idx - 1].isDelivered;
  },

  isStopCompleted: (stopId) => {
    return get().stops.find(s => s.id === stopId)?.isDelivered ?? false;
  },

  completedCount: () => {
    return get().stops.filter(s => s.isDelivered).length;
  },
}));
