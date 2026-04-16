import { act, renderHook } from '@testing-library/react-native';

import { clearTokenSnapshot } from '@/lib/auth/token-snapshot';

import {
  restoreSession as restoreSessionApi,
  signIn as signInApi,
  signOut as signOutApi,
  useAuthStore,
} from './use-auth-store';

jest.mock('@/lib/auth/token-keychain', () => ({
  setTokenPairInKeychain: jest.fn().mockResolvedValue(true),
  clearTokenPairFromKeychain: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/api/provider', () => ({
  queryClient: { clear: jest.fn() },
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
const providerMock = jest.requireMock('@/lib/api/provider') as {
  queryClient: { clear: jest.Mock };
};
const queryClearMock = providerMock.queryClient.clear;

describe('useAuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearTokenSnapshot();
    setTokenPairInKeychain.mockResolvedValue(true);
    act(() => {
      signOutApi();
    });
  });

  it('signIn persists to keychain and sets state', async () => {
    const token = { access: 'acc', refresh: 'ref' };

    await act(async () => {
      await signInApi(token);
    });

    const { result } = renderHook(() => useAuthStore());
    expect(result.current.token).toEqual(token);
    expect(result.current.status).toBe('signIn');
    expect(setTokenPairInKeychain).toHaveBeenCalledWith(token);
  });

  it('signOut clears token, snapshot, keychain path, MMKV legacy, and React Query', async () => {
    await act(async () => {
      await signInApi({ access: 'a', refresh: 'b' });
    });
    act(() => {
      signOutApi();
    });

    const { result } = renderHook(() => useAuthStore());
    expect(result.current.token).toBeNull();
    expect(result.current.status).toBe('signOut');
    expect(queryClearMock).toHaveBeenCalled();
    expect(clearTokenPairFromKeychain).toHaveBeenCalled();
    expect(removeItemMock).toHaveBeenCalledWith('token');
  });

  it('restoreSession sets state and snapshot without keychain write', () => {
    const token = { access: 'x', refresh: 'y' };
    act(() => {
      restoreSessionApi(token);
    });

    expect(setTokenPairInKeychain).not.toHaveBeenCalled();
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.token).toEqual(token);
    expect(result.current.status).toBe('signIn');
  });

  it('signIn calls signOut when keychain write fails', async () => {
    setTokenPairInKeychain.mockResolvedValueOnce(false);

    await act(async () => {
      await signInApi({ access: 'a', refresh: 'b' });
    });

    const { result } = renderHook(() => useAuthStore());
    expect(result.current.status).toBe('signOut');
    expect(result.current.token).toBeNull();
  });
});
