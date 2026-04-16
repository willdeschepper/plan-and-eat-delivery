import type { StoreApi, UseBoundStore } from 'zustand';
import { Linking } from 'react-native';

export function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then(canOpen => canOpen && Linking.openURL(url));
}

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & {
    use: {
      [K in keyof T as T[K] extends (...args: any[]) => any
        ? never
        : K]: () => T[K];
    };
  }
  : never;

/**
 * Creates optimized selectors for Zustand store.
 * Automatically excludes functions (actions) from selectors to prevent unnecessary re-renders.
 * Only state values are exposed as selectors.
 *
 * @example
 * const store = createSelectors(useAuthStore);
 * const status = store.use.status(); // Only re-renders when status changes
 */
export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(_store: S) {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {} as WithSelectors<typeof _store>['use'];

  const state = store.getState();
  for (const k of Object.keys(state)) {
    const key = k as keyof typeof state;
    // Only create selectors for non-function values
    if (typeof state[key] !== 'function') {
      (store.use as any)[key] = () => store(s => s[key]);
    }
  }

  return store;
}
