import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { TokenType } from '@/lib/auth/utils';
import axios from 'axios';
import Env from 'env';
import {
  logApiFailure,
  logApiOutgoingRequest,
} from '@/lib/api/log-api-debug';
import { getToken } from '@/lib/auth/utils';
import { signIn, signOut } from '@/lib/hooks/use-auth-store';

export const client = axios.create({
  baseURL: Env.EXPO_PUBLIC_API_URL,
});

// A separate, pure axios instance specifically for authentication endpoints.
// This prevents interceptors (like the one that attaches the expired token)
// from interfering with the refresh process or causing infinite loops.
const authClient = axios.create({
  baseURL: Env.EXPO_PUBLIC_API_URL,
});

client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token?.access && !config.url?.includes('/api/customers/refresh/')) {
      config.headers = Object.assign(config.headers, {
        Authorization: `Bearer ${token.access}`,
      });
    }

    logApiOutgoingRequest(config);

    return config;
  },
  error => Promise.reject(error),
);

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const currentToken = getToken();

  if (!currentToken?.refresh) {
    throw new Error('No refresh token available');
  }

  console.log('[auth:refresh] 🔄 Sending refresh request', {
    hasRefreshToken: Boolean(currentToken.refresh),
    refreshTokenLength: currentToken.refresh?.length ?? 0,
    refreshTokenPrefix: currentToken.refresh,
    hasAccessToken: Boolean(currentToken.access),
    accessTokenPrefix: currentToken.access,
  });

  isRefreshing = true;
  refreshPromise = authClient
    .post('/api/customers/refresh/', { refresh: currentToken.refresh })
    .then(async (response) => {
      const data = response.data as { access: string; refresh?: string };

      console.log('[auth:refresh] ✅ Got new tokens from server', {
        hasNewAccess: Boolean(data.access),
        newAccessPrefix: `${data.access?.slice(0, 20)}...`,
        hasNewRefresh: Boolean(data.refresh),
        willReuseOldRefresh: !data.refresh,
      });

      const nextToken: TokenType = {
        access: data.access,
        refresh: data.refresh ?? currentToken.refresh,
      };

      await signIn(nextToken);
    })
    .catch((error) => {
      signOut();
      throw error;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

type AuthedRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

client.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const { response } = error;
    const config = error.config as AuthedRequestConfig;

    logApiFailure(
      'axios_response_error',
      error,
      !response || !config
        ? { note: 'missing response or config (often network / bad URL)' }
        : undefined,
    );

    if (!response || !config) {
      return Promise.reject(error);
    }

    if (response.status !== 401) {
      return Promise.reject(error);
    }

    // If the refresh endpoint itself returned 401, bail out immediately
    // without marking _retry to avoid confusion in future retries.
    if (config.url?.includes('/api/customers/refresh/')) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loops: if we already retried this exact request, give up.
    if (config._retry) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      await refreshAccessToken();
      const token = getToken();

      if (token?.access) {
        config.headers.set('Authorization', `Bearer ${token.access}`);
      }

      return client(config);
    }
    catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
