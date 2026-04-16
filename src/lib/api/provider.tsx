/* eslint-disable react-refresh/only-export-components */
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { onlineManager, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { AppState } from 'react-native';

import { createAppQueryClient } from '@/lib/api/query-client';
import { getIsOnline, startNetworkStatus, subscribe } from '@/lib/network/network-status';

export const queryClient = createAppQueryClient();

// Shared debounce between M1-F (online restore) and M4 (foreground return)
// to prevent double-burst of refetch when both events fire within the same window.
let lastInvalidateAt = 0;
const REFETCH_DEBOUNCE_MS = 500;

export function APIProvider({ children }: { children: React.ReactNode }) {
  useReactQueryDevTools(queryClient);

  React.useEffect(() => {
    return startNetworkStatus();
  }, []);

  React.useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      setOnline(getIsOnline());
      return subscribe((online) => {
        setOnline(online);
      });
    });
    return () => {
      onlineManager.setEventListener(() => undefined);
    };
  }, []);

  // M1-F: invalidate all queries when network restores (offline → online).
  React.useEffect(() => {
    let previousOnline = getIsOnline();
    return subscribe((online) => {
      if (previousOnline === false && online === true) {
        lastInvalidateAt = Date.now();
        void queryClient.invalidateQueries();
      }
      previousOnline = online;
    });
  }, []);

  // M4-A/B/C/D: refetch active queries when app returns from real background.
  // M4-B: only reacts to background → active transition, not inactive (system overlays, calls).
  // M4-D: skips refetch when offline; M1-F will handle data sync after network restores.
  // M4-C: uses refetchType:'active' to only refetch mounted queries, not all stale ones.
  React.useEffect(() => {
    let wasInBackground = false;

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background') {
        wasInBackground = true;
      }
      else if (nextState === 'active' && wasInBackground) {
        wasInBackground = false;
        if (
          getIsOnline()
          && Date.now() - lastInvalidateAt > REFETCH_DEBOUNCE_MS
        ) {
          lastInvalidateAt = Date.now();
          void queryClient.refetchQueries({ type: 'active' });
        }
      }
      // inactive (incoming call, system sheet) does NOT trigger refetch
    });

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
