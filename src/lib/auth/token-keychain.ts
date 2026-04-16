import type { TokenType } from '@/lib/auth/token-types';

import { NativeModules, Platform } from 'react-native';
import {
  ACCESSIBLE,
  getGenericPassword,
  resetGenericPassword,
  setGenericPassword,
} from 'react-native-keychain';

function isKeychainNativeAvailable(): boolean {
  return Platform.OS !== 'web' && NativeModules.RNKeychainManager != null;
}

/**
 * Fixed Keychain service id for the courier auth token pair.
 * Do not change without a migration — existing installs would lose the session.
 */
export const TOKEN_KEYCHAIN_SERVICE = 'com.planandeat.courier.auth.token.v1';

const KEYCHAIN_USERNAME = 'session';

export async function getTokenPairFromKeychain(): Promise<TokenType | null> {
  if (!isKeychainNativeAvailable())
    return null;
  const creds = await getGenericPassword({ service: TOKEN_KEYCHAIN_SERVICE });
  if (creds === false || !creds.password)
    return null;
  try {
    const parsed = JSON.parse(creds.password) as TokenType;
    if (parsed?.access && parsed?.refresh)
      return parsed;
    return null;
  }
  catch {
    return null;
  }
}

export async function setTokenPairInKeychain(token: TokenType): Promise<boolean> {
  if (!isKeychainNativeAvailable())
    return false;
  const result = await setGenericPassword(
    KEYCHAIN_USERNAME,
    JSON.stringify(token),
    {
      service: TOKEN_KEYCHAIN_SERVICE,
      accessible: ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    },
  );
  return result !== false;
}

export async function clearTokenPairFromKeychain(): Promise<void> {
  if (!isKeychainNativeAvailable())
    return;
  await resetGenericPassword({ service: TOKEN_KEYCHAIN_SERVICE });
}
