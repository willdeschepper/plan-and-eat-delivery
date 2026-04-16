import type { TokenType } from '@/lib/auth/token-types';
import { clearTokenPairFromKeychain, setTokenPairInKeychain } from '@/lib/auth/token-keychain';
import {
  clearTokenSnapshot,
  getTokenSnapshot,
  setTokenSnapshot,
} from '@/lib/auth/token-snapshot';
import { removeItem } from '@/lib/storage';

export type { TokenType } from '@/lib/auth/token-types';

/** Legacy MMKV key — kept only for migration cleanup in signOut. */
const LEGACY_TOKEN_MMKV_KEY = 'token';

/** Sync read for axios interceptors (in-memory snapshot). */
export const getToken = (): TokenType | null => getTokenSnapshot();

/** Persist pair to Keychain and refresh the in-memory snapshot. */
export async function setToken(value: TokenType): Promise<boolean> {
  const ok = await setTokenPairInKeychain(value);
  if (ok) {
    console.log('[auth:setToken] ✅ Token set successfully', value);
    setTokenSnapshot(value);
  }
  return ok;
}

/** Clear Keychain pair, snapshot, and any legacy MMKV token. */
export async function removeToken(): Promise<void> {
  clearTokenSnapshot();
  await clearTokenPairFromKeychain();
  await removeItem(LEGACY_TOKEN_MMKV_KEY);
}
