import type { TokenType } from '@/lib/auth/token-types';

import {
  getTokenPairFromKeychain,
  setTokenPairInKeychain,
} from '@/lib/auth/token-keychain';
import { storage } from '@/lib/storage';

const LEGACY_TOKEN_MMKV_KEY = 'token';

/**
 * One-time style migration: if a token still lives in MMKV and Keychain is empty,
 * copy to Keychain and remove the MMKV key. Idempotent.
 */
export async function migrateTokenFromMmkvIfNeeded(): Promise<void> {
  const existing = await getTokenPairFromKeychain();
  if (existing)
    return;

  const raw = storage.getString(LEGACY_TOKEN_MMKV_KEY);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw) as TokenType;
    if (parsed?.access && parsed?.refresh) {
      const written = await setTokenPairInKeychain(parsed);
      if (written)
        storage.remove(LEGACY_TOKEN_MMKV_KEY);
    }
    else {
      storage.remove(LEGACY_TOKEN_MMKV_KEY);
    }
  }
  catch {
    storage.remove(LEGACY_TOKEN_MMKV_KEY);
  }
}
