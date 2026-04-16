/**
 * Tests axios client interceptors. Uses a single mocked axios instance (same reference as `client` export).
 */
import { client } from './client';

const tokenRef: { current: { access: string; refresh: string } | null } = {
  current: null,
};

let clientAxiosMocks: {
  mockPost: jest.Mock;
  mockClientRequest: jest.Mock;
};

jest.mock('env', () => ({
  __esModule: true,
  default: { EXPO_PUBLIC_API_URL: 'http://api.test' },
}));

jest.mock('@/lib/api/log-api-debug', () => ({
  logApiOutgoingRequest: jest.fn(),
  logApiFailure: jest.fn(),
}));

jest.mock('@/lib/auth/utils', () => ({
  getToken: () => tokenRef.current,
}));

jest.mock('@/lib/hooks/use-auth-store', () => {
  const signIn = jest.fn(async (t: { access: string; refresh: string }) => {
    tokenRef.current = t;
  });
  const signOut = jest.fn(() => {
    tokenRef.current = null;
  });
  return { signIn, signOut };
});

jest.mock('axios', () => {
  const mockPost = jest.fn();
  const mockClientRequest = jest.fn();
  clientAxiosMocks = { mockPost, mockClientRequest };

  const instance: any = function clientRequest(config: unknown) {
    return mockClientRequest(config);
  };
  instance.post = mockPost;
  instance.interceptors = {
    request: {
      use: jest.fn((onFulfilled: any, onRejected: any) => {
        instance._requestOnFulfilled = onFulfilled;
        instance._requestOnRejected = onRejected;
        return 0;
      }),
    },
    response: {
      use: jest.fn((onFulfilled: any, onRejected: any) => {
        instance._responseOnFulfilled = onFulfilled;
        instance._responseOnRejected = onRejected;
        return 0;
      }),
    },
  };
  instance.defaults = {};

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => instance),
    },
  };
});

const { signIn: signInMock, signOut: signOutMock } = jest.requireMock(
  '@/lib/hooks/use-auth-store',
) as { signIn: jest.Mock; signOut: jest.Mock };

function getClient(): any {
  return client as any;
}

const { mockPost, mockClientRequest } = clientAxiosMocks;

function err401(config: { url?: string; headers?: object }): any {
  return {
    response: { status: 401, data: {} },
    config: { headers: { ...(config.headers ?? {}) }, url: config.url ?? '/api/protected' },
    isAxiosError: true,
  };
}

describe('api client interceptors', () => {
  beforeEach(() => {
    tokenRef.current = null;
    signInMock.mockClear();
    signOutMock.mockClear();
    mockPost.mockReset();
    mockClientRequest.mockReset();
    signInMock.mockImplementation(async (t: { access: string; refresh: string }) => {
      tokenRef.current = t;
    });
    signOutMock.mockImplementation(() => {
      tokenRef.current = null;
    });
  });

  it('request interceptor adds Authorization when access token exists', () => {
    tokenRef.current = { access: 'acc-1', refresh: 'ref-1' };
    const cfg = { headers: {} };
    const out = getClient()._requestOnFulfilled(cfg);
    expect(out.headers.Authorization).toBe('Bearer acc-1');
  });

  it('request interceptor leaves config when no token', () => {
    tokenRef.current = null;
    const cfg = { headers: {} };
    const out = getClient()._requestOnFulfilled(cfg);
    expect(out.headers.Authorization).toBeUndefined();
  });

  it('response interceptor rejects when response or config missing', async () => {
    const e = { message: 'net', response: undefined, config: undefined };
    await expect(getClient()._responseOnRejected(e)).rejects.toBe(e);
  });

  it('response interceptor rejects non-401 without refresh', async () => {
    const e = {
      response: { status: 500 },
      config: { headers: {}, url: '/x' },
    };
    await expect(getClient()._responseOnRejected(e)).rejects.toBe(e);
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('response interceptor rejects 401 on refresh URL without calling refresh', async () => {
    const e = err401({ url: '/api/customers/refresh/' });
    await expect(getClient()._responseOnRejected(e)).rejects.toBe(e);
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('401 triggers refresh then retries original request with new access', async () => {
    tokenRef.current = { access: 'old', refresh: 'refresh-token' };
    mockPost.mockResolvedValueOnce({
      data: { access: 'new-access', refresh: 'new-refresh' },
    });
    mockClientRequest.mockResolvedValueOnce({ status: 200, data: 'retry-ok' });

    const e = err401({ url: '/api/other/' });
    const result = await getClient()._responseOnRejected(e);

    expect(mockPost).toHaveBeenCalledWith('/api/customers/refresh/', {
      refresh: 'refresh-token',
    });
    expect(signInMock).toHaveBeenCalledWith({
      access: 'new-access',
      refresh: 'new-refresh',
    });
    expect(mockClientRequest).toHaveBeenCalledTimes(1);
    expect(result.data).toBe('retry-ok');
  });

  it('refresh failure calls signOut and rejects', async () => {
    tokenRef.current = { access: 'old', refresh: 'refresh-token' };
    const fail = new Error('refresh failed');
    mockPost.mockRejectedValueOnce(fail);

    const e = err401({ url: '/api/data' });
    await expect(getClient()._responseOnRejected(e)).rejects.toBe(fail);
    expect(signOutMock).toHaveBeenCalled();
  });

  it('refresh throws when no refresh token', async () => {
    tokenRef.current = { access: 'only-access', refresh: '' as unknown as string };
    const e = err401({ url: '/api/data' });
    await expect(getClient()._responseOnRejected(e)).rejects.toThrow(
      'No refresh token available',
    );
  });
});
