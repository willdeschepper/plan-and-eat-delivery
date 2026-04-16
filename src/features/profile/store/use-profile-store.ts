import { create } from 'zustand';

type ProfileStore = {
  initialized: boolean;
  setInitialized: (value: boolean) => void;
};

export const useProfileStore = create<ProfileStore>(set => ({
  initialized: false,
  setInitialized: value => set({ initialized: value }),
}));
