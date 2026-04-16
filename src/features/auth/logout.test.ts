import { Alert } from 'react-native';

import { logoutWithBackend } from './logout';

jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

let logoutPostMock: jest.Mock;
let logoutSignOutMock: jest.Mock;
/** Token returned by mocked getToken — name must be mock* for jest.mock factory scope. */
let mockLogoutTokenRef: { access: string; refresh: string } | null;

jest.mock('@/lib/api', () => {
  const post = jest.fn();
  logoutPostMock = post;
  return { client: { post } };
});

jest.mock('@/lib/auth/utils', () => ({
  getToken: () => mockLogoutTokenRef,
}));

jest.mock('@/lib/hooks/use-auth-store', () => {
  const fn = jest.fn();
  logoutSignOutMock = fn;
  return { signOut: () => fn() };
});

describe('logoutWithBackend', () => {
  beforeEach(() => {
    logoutSignOutMock.mockClear();
    (Alert.alert as jest.Mock).mockClear();
    mockLogoutTokenRef = { access: 'a', refresh: 'refresh-1' };
    logoutPostMock.mockReset();
    logoutPostMock.mockResolvedValue({ data: {} });
  });

  it('posts logout with refresh when token has refresh', async () => {
    await logoutWithBackend();
    expect(logoutPostMock).toHaveBeenCalledWith('/api/customers/logout/', {
      refresh: 'refresh-1',
    });
    expect(logoutSignOutMock).toHaveBeenCalled();
  });

  it('skips post when no refresh token but still signs out', async () => {
    mockLogoutTokenRef = { access: 'only', refresh: '' };
    await logoutWithBackend();
    expect(logoutPostMock).not.toHaveBeenCalled();
    expect(logoutSignOutMock).toHaveBeenCalled();
  });

  it('shows alert on API error and still signs out in finally', async () => {
    logoutPostMock.mockRejectedValueOnce(new Error('network'));
    await logoutWithBackend();
    expect(Alert.alert).toHaveBeenCalled();
    expect(logoutSignOutMock).toHaveBeenCalled();
  });
});
