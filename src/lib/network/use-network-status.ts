import { useSyncExternalStore } from 'react';

import { getIsOnline, subscribe } from '@/lib/network/network-status';

/** React views use the same subscribe/getIsOnline as TanStack `onlineManager` and Axios helpers. */
export function useNetworkStatus(): boolean {
  return useSyncExternalStore(subscribe, getIsOnline, getIsOnline);
}
