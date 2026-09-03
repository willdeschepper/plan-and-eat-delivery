import * as React from 'react';

import { flushPendingCompletions } from '@/features/courier/completion-queue';
import { courierOrdersQueryKey } from '@/features/courier/types';
import { queryClient } from '@/lib/api/provider';
import { useAuthStore } from '@/lib/hooks';
import { getIsOnline, subscribe } from '@/lib/network/network-status';

export function CompletionQueueHost(): null {
  const status = useAuthStore.use.status();

  React.useEffect(() => {
    if (status !== 'signIn')
      return;

    const flush = () => {
      if (!getIsOnline())
        return;

      void flushPendingCompletions(() => {
        void queryClient.invalidateQueries({ queryKey: courierOrdersQueryKey });
      });
    };

    flush();
    return subscribe((online) => {
      if (online)
        flush();
    });
  }, [status]);

  return null;
}
