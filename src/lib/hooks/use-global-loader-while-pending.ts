import * as React from 'react';

import { useGlobalLoaderStore } from '@/lib/hooks/use-global-loader-store';

/**
 * Shows the global indeterminate loader while `isPending` is true (when `enabled`).
 * Hides on transition to non-pending and on unmount so the overlay never sticks after navigation.
 */
export function useGlobalLoaderWhilePending(isPending: boolean, enabled = true): void {
  React.useEffect(() => {
    if (enabled && isPending) {
      useGlobalLoaderStore.getState().showIndeterminate();
    }
    else {
      useGlobalLoaderStore.getState().hide();
    }
    return () => {
      useGlobalLoaderStore.getState().hide();
    };
  }, [isPending, enabled]);
}
