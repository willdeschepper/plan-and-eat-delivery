import { createAppQueryClient } from './query-client';

describe('createAppQueryClient', () => {
  it('sets expected default query options', () => {
    const qc = createAppQueryClient();
    const q = qc.getDefaultOptions().queries;
    expect(q?.staleTime).toBe(60_000);
    expect(q?.gcTime).toBe(5 * 60_000);
    expect(q?.retry).toBe(3);
    expect(q?.networkMode).toBe('offlineFirst');
    expect(q?.retryDelay?.(0)).toBe(1000);
    expect(q?.retryDelay?.(1)).toBe(2000);
    expect(q?.retryDelay?.(5)).toBe(30_000);
  });

  it('sets mutation defaults', () => {
    const qc = createAppQueryClient();
    const m = qc.getDefaultOptions().mutations;
    expect(m?.retry).toBe(0);
    expect(m?.networkMode).toBe('offlineFirst');
  });
});
