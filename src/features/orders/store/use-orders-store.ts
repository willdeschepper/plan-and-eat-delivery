import { create } from 'zustand';

import { MOCK_PROFILE, MOCK_STOPS } from '../mock-data';
import type { CourierProfile, DeliveryStop } from '../types';

type OrdersState = {
  stops: DeliveryStop[];
  profile: CourierProfile;
  toggleOrderPickedUp: (stopId: string, orderId: string) => void;
  isStopLocked: (stopId: string) => boolean;
  isStopCompleted: (stopId: string) => boolean;
  completedCount: () => number;
};

function computeStopCompleted(stop: DeliveryStop): boolean {
  return stop.orders.length > 0 && stop.orders.every(o => o.isPickedUp);
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  stops: MOCK_STOPS,
  profile: MOCK_PROFILE,

  toggleOrderPickedUp: (stopId, orderId) => {
    set(state => {
      const stops = state.stops.map(stop => {
        if (stop.id !== stopId) return stop;
        const orders = stop.orders.map(order => {
          if (order.id !== orderId) return order;
          return { ...order, isPickedUp: !order.isPickedUp };
        });
        return { ...stop, orders };
      });

      const updatedStop = stops.find(s => s.id === stopId);
      const wasCompleted = computeStopCompleted(
        state.stops.find(s => s.id === stopId)!,
      );
      const nowCompleted = updatedStop ? computeStopCompleted(updatedStop) : false;

      const completedDelta = nowCompleted && !wasCompleted ? 1 : !nowCompleted && wasCompleted ? -1 : 0;

      return {
        stops,
        profile: {
          ...state.profile,
          completedOrdersToday: Math.max(0, state.profile.completedOrdersToday + completedDelta),
          totalEarnings: Math.max(0, state.profile.totalEarnings + completedDelta * 8.5),
        },
      };
    });
  },

  isStopLocked: (stopId) => {
    const { stops } = get();
    const idx = stops.findIndex(s => s.id === stopId);
    if (idx <= 0) return false;
    const prev = stops[idx - 1];
    return !computeStopCompleted(prev);
  },

  isStopCompleted: (stopId) => {
    const stop = get().stops.find(s => s.id === stopId);
    return stop ? computeStopCompleted(stop) : false;
  },

  completedCount: () => {
    return get().stops.filter(s => computeStopCompleted(s)).length;
  },
}));
