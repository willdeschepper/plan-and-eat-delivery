import type { TokenType } from '@/lib/auth/token-types';

import { create } from 'zustand';

import { queryClient } from '@/lib/api/provider';
import { clearTokenPairFromKeychain, setTokenPairInKeychain } from '@/lib/auth/token-keychain';
import { clearTokenSnapshot, setTokenSnapshot } from '@/lib/auth/token-snapshot';
import { removeItem } from '@/lib/storage';
import { createSelectors } from '@/lib/utils';

/** Legacy MMKV key — cleared on signOut alongside Keychain. */
const LEGACY_TOKEN_MMKV_KEY = 'token';

type AuthState = {
  token: TokenType | null;
  status: 'idle' | 'signOut' | 'signIn';
  signIn: (data: TokenType) => Promise<void>;
  signOut: () => void;
  /** Restore memory + Zustand from Keychain after cold start (no Keychain write). */
  restoreSession: (data: TokenType) => void;
};

const _useAuthStore = create<AuthState>(set => ({
  status: 'idle',
  token: null,
  signIn: async (token) => {
    console.log('[auth:signIn] 🔑 signIn called', {
      hasAccess: Boolean(token.access),
      accessPrefix: `${token.access?.slice(0, 20)}...`,
      hasRefresh: Boolean(token.refresh),
      refreshPrefix: `${token.refresh?.slice(0, 20)}...`,
    });

    // Always update the in-memory snapshot first so axios interceptors
    // can immediately use the new access token (important during refresh flow).
    setTokenSnapshot(token);
    set({ status: 'signIn', token });

    console.log('[auth:signIn] 💾 Snapshot and Zustand updated. Writing to Keychain...');

    // Best-effort Keychain persist — failure is non-fatal for the current session.
    // On next cold start the session will be gone, but the user won't be kicked out now.
    const ok = await setTokenPairInKeychain(token);
    if (!ok) {
      console.warn('[auth] ⚠️ setTokenPairInKeychain failed — token kept only in memory for this session');
    }
    else {
      console.log('[auth:signIn] ✅ Keychain write successful');
    }
  },
  signOut: () => {
    clearTokenSnapshot();
    queryClient.clear();
    set({ status: 'signOut', token: null });
    void (async () => {
      await clearTokenPairFromKeychain();
      await removeItem(LEGACY_TOKEN_MMKV_KEY);
    })();
  },
  restoreSession: (token) => {
    setTokenSnapshot(token);
    set({ status: 'signIn', token });
  },
}));

export const useAuthStore = createSelectors(_useAuthStore);

export function signOut(): void {
  _useAuthStore.getState().signOut();
}

export async function signIn(token: TokenType): Promise<void> {
  await _useAuthStore.getState().signIn(token);
}

export function restoreSession(token: TokenType): void {
  _useAuthStore.getState().restoreSession(token);
}
