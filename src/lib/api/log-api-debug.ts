import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';

const TAG = '[api]';

export function isApiDebugEnabled(): boolean {
  if (process.env.EXPO_PUBLIC_API_DEBUG === '1')
    return true;
  return typeof __DEV__ !== 'undefined' && __DEV__;
}

export function buildApiRequestUrl(config: InternalAxiosRequestConfig): string {
  try {
    return axios.getUri(config);
  }
  catch {
    const base = (config.baseURL ?? '').replace(/\/$/, '');
    const path = (config.url ?? '').replace(/^\//, '');
    return path ? `${base}/${path}` : base;
  }
}

/**
 * Logs each outgoing HTTP call (method, resolved URL, auth header present). No request body.
 */
export function logApiOutgoingRequest(config: InternalAxiosRequestConfig): void {
  if (!isApiDebugEnabled())
    return;

  const fullUrl = buildApiRequestUrl(config);
  const headers = config.headers;
  const headersRecord
    = headers && typeof headers === 'object'
      ? (headers as Record<string, unknown>)
      : null;
  const authHeader = headersRecord?.Authorization ?? headersRecord?.authorization;

  console.log(TAG, 'request', {
    method: (config.method ?? 'get').toUpperCase(),
    fullUrl,
    hasAuthHeader: Boolean(authHeader),
  });
}

export type LogApiFailureExtra = Record<string, unknown>;

/**
 * Logs Axios / network failures: status, response body, URL. Never logs request body (passwords, tokens).
 */
export function logApiFailure(
  context: string,
  error: unknown,
  extra?: LogApiFailureExtra,
): void {
  if (!isApiDebugEnabled())
    return;

  const err = error as AxiosError | undefined;
  const config = err?.config;
  const fullUrl = config ? buildApiRequestUrl(config) : undefined;

  console.warn(TAG, context, {
    ...extra,
    axiosMessage: err?.message,
    axiosCode: err?.code,
    httpStatus: err?.response?.status,
    statusText: err?.response?.statusText,
    responseData: err?.response?.data,
    baseURL: config?.baseURL,
    requestPath: config?.url,
    fullUrl,
    hasResponse: Boolean(err?.response),
    hasConfig: Boolean(config),
  });
}

/** Call from env bootstrap: resolved API base URL in dev. */
export function logResolvedApiBaseUrl(apiBaseUrl: string): void {
  if (!isApiDebugEnabled())
    return;
  console.log(TAG, 'EXPO_PUBLIC_API_URL', apiBaseUrl);
}

/** Call when API base URL is missing — always log so misconfiguration is visible. */
export function logMissingApiBaseUrl(): void {
  console.error(
    TAG,
    'EXPO_PUBLIC_API_URL is empty — set EXPO_PUBLIC_API_URL_DEVELOPMENT / EXPO_PUBLIC_API_URL_PRODUCTION in .env and restart with: pnpm start -c',
  );
}
