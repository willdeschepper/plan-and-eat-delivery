import { create } from 'zustand';

type RouteMapStore = {
  initialized: boolean;
  setInitialized: (value: boolean) => void;
};

export const useRouteMapStore = create<RouteMapStore>(set => ({
  initialized: false,
  setInitialized: value => set({ initialized: value }),
}));
