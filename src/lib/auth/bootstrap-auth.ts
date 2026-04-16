import { migrateTokenFromMmkvIfNeeded } from '@/lib/auth/migrate-token-from-mmkv';
import { getTokenPairFromKeychain } from '@/lib/auth/token-keychain';
import {
  restoreSession,
  signOut,
} from '@/lib/hooks/use-auth-store';

/**
 * Cold start: migrate legacy MMKV token, load Keychain, apply Zustand + snapshot.
 * On any failure, fully sign out (M2-A).
 */
export async function runAuthBootstrap(): Promise<void> {
  try {
    await migrateTokenFromMmkvIfNeeded();
    const pair = await getTokenPairFromKeychain();
    if (pair)
      restoreSession(pair);
    else
      signOut();
  }
  catch (e) {
    console.error('runAuthBootstrap', e);
    signOut();
  }
}
