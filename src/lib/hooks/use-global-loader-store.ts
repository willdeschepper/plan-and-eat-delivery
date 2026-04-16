import { create } from 'zustand';

export type GlobalLoaderMode = 'indeterminate' | 'determinate';

function clamp01(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.min(1, Math.max(0, value));
}

type GlobalLoaderState = {
  visible: boolean;
  mode: GlobalLoaderMode;
  /** Normalized fill height for determinate mode (0–1). */
  progress: number;
  /**
   * Blocking wait with looping fill. Call `hide()` when work finishes.
   * @example useGlobalLoaderStore.getState().showIndeterminate(); await work(); useGlobalLoaderStore.getState().hide();
   */
  showIndeterminate: () => void;
  /**
   * Show overlay with a known fraction (e.g. upload). Update via `setProgress`, then `hide()`.
   * @param initialProgress — defaults to 0
   */
  showWithProgress: (initialProgress?: number) => void;
  /** Updates fill height; switches to determinate while the overlay is visible. */
  setProgress: (value: number) => void;
  hide: () => void;
};

export const useGlobalLoaderStore = create<GlobalLoaderState>((set, get) => ({
  visible: false,
  mode: 'indeterminate',
  progress: 0,

  showIndeterminate: () => {
    set({ visible: true, mode: 'indeterminate', progress: 0 });
  },

  showWithProgress: (initialProgress = 0) => {
    set({ visible: true, mode: 'determinate', progress: clamp01(initialProgress) });
  },

  setProgress: (value: number) => {
    if (!get().visible) {
      return;
    }
    set({ progress: clamp01(value), mode: 'determinate' });
  },

  hide: () => {
    set({ visible: false, progress: 0, mode: 'indeterminate' });
  },
}));
