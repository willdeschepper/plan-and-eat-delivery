import { QueryClient } from '@tanstack/react-query';

/**
 * Default React Query behavior for M1: offline-first reads, bounded retries with backoff.
 * Extend query keys in invalidate-on-reconnect logic when adding features.
 */
export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        gcTime: 5 * 60_000,
        retry: 3,
        retryDelay: (attemptIndex: number) =>
          Math.min(1000 * 2 ** attemptIndex, 30_000),
        networkMode: 'offlineFirst',
      },
      mutations: {
        retry: 0,
        networkMode: 'offlineFirst',
      },
    },
  });
}
