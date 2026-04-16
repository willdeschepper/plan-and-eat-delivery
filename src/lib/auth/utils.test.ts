import { clearTokenSnapshot } from '@/lib/auth/token-snapshot';

import { getToken, removeToken, setToken } from './utils';

jest.mock('@/lib/auth/token-keychain', () => ({
  setTokenPairInKeychain: jest.fn().mockResolvedValue(true),
  clearTokenPairFromKeychain: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/storage', () => ({
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

const setTokenPairInKeychain = jest.requireMock('@/lib/auth/token-keychain')
  .setTokenPairInKeychain as jest.Mock;
const clearTokenPairFromKeychain = jest.requireMock('@/lib/auth/token-keychain')
  .clearTokenPairFromKeychain as jest.Mock;
const removeItemMock = jest.requireMock('@/lib/storage')
  .removeItem as jest.Mock;

describe('lib/auth/utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearTokenSnapshot();
    setTokenPairInKeychain.mockResolvedValue(true);
  });

  it('getToken returns null when snapshot is empty', () => {
    expect(getToken()).toBeNull();
  });

  it('setToken writes keychain and updates snapshot on success', async () => {
    const tok = { access: 'a', refresh: 'r' };
    const ok = await setToken(tok);
    expect(ok).toBe(true);
    expect(setTokenPairInKeychain).toHaveBeenCalledWith(tok);
    expect(getToken()).toEqual(tok);
  });

  it('setToken does not update snapshot when keychain write fails', async () => {
    setTokenPairInKeychain.mockResolvedValueOnce(false);
    const tok = { access: 'a', refresh: 'r' };
    const ok = await setToken(tok);
    expect(ok).toBe(false);
    expect(getToken()).toBeNull();
  });

  it('removeToken clears snapshot, keychain, and legacy MMKV key', async () => {
    await setToken({ access: 'a', refresh: 'r' });
    await removeToken();
    expect(clearTokenPairFromKeychain).toHaveBeenCalled();
    expect(removeItemMock).toHaveBeenCalledWith('token');
    expect(getToken()).toBeNull();
  });
});
