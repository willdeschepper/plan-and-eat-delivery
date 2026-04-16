import type { TokenType } from '@/lib/auth/token-types';

let snapshot: TokenType | null = null;

/** In-memory pair for synchronous reads (e.g. axios request interceptor). */
export function getTokenSnapshot(): TokenType | null {
  return snapshot;
}

export function setTokenSnapshot(token: TokenType | null): void {
  snapshot = token;
}

export function clearTokenSnapshot(): void {
  snapshot = null;
}
