import type { InternalAxiosRequestConfig } from 'axios';

import {
  buildApiRequestUrl,
  isApiDebugEnabled,
  logApiFailure,
  logApiOutgoingRequest,
  logResolvedApiBaseUrl,
} from './log-api-debug';

describe('log-api-debug', () => {
  const originalDev = globalThis.__DEV__;
  const originalEnv = process.env.EXPO_PUBLIC_API_DEBUG;

  afterEach(() => {
    Object.defineProperty(globalThis, '__DEV__', {
      value: originalDev,
      configurable: true,
      writable: true,
    });
    if (originalEnv === undefined) {
      delete process.env.EXPO_PUBLIC_API_DEBUG;
    }
    else {
      process.env.EXPO_PUBLIC_API_DEBUG = originalEnv;
    }
    jest.restoreAllMocks();
  });

  describe('isApiDebugEnabled', () => {
    it('returns true when EXPO_PUBLIC_API_DEBUG is 1', () => {
      process.env.EXPO_PUBLIC_API_DEBUG = '1';
      expect(isApiDebugEnabled()).toBe(true);
    });

    it('returns false when flag off and __DEV__ false', () => {
      delete process.env.EXPO_PUBLIC_API_DEBUG;
      Object.defineProperty(globalThis, '__DEV__', { value: false, configurable: true });
      expect(isApiDebugEnabled()).toBe(false);
    });
  });

  describe('buildApiRequestUrl', () => {
    it('joins baseURL and url', () => {
      const config = {
        baseURL: 'https://api.example/',
        url: '/v1/users',
        method: 'get',
      } as InternalAxiosRequestConfig;
      expect(buildApiRequestUrl(config)).toBe('https://api.example/v1/users');
    });
  });

  describe('logApiOutgoingRequest', () => {
    it('no-ops when debug disabled', () => {
      delete process.env.EXPO_PUBLIC_API_DEBUG;
      Object.defineProperty(globalThis, '__DEV__', { value: false, configurable: true });
      const log = jest.spyOn(console, 'log').mockImplementation(() => {});
      logApiOutgoingRequest({
        method: 'get',
        baseURL: 'https://x',
        url: '/y',
        headers: {},
      } as InternalAxiosRequestConfig);
      expect(log).not.toHaveBeenCalled();
    });

    it('logs method and url when debug enabled', () => {
      process.env.EXPO_PUBLIC_API_DEBUG = '1';
      const log = jest.spyOn(console, 'log').mockImplementation(() => {});
      logApiOutgoingRequest({
        method: 'post',
        baseURL: 'https://api.test',
        url: 'login',
        headers: { Authorization: 'Bearer x' },
      } as InternalAxiosRequestConfig);
      expect(log).toHaveBeenCalledWith(
        '[api]',
        'request',
        expect.objectContaining({
          method: 'POST',
          fullUrl: expect.stringContaining('login'),
          hasAuthHeader: true,
        }),
      );
    });
  });

  describe('logApiFailure', () => {
    it('no-ops when debug disabled', () => {
      delete process.env.EXPO_PUBLIC_API_DEBUG;
      Object.defineProperty(globalThis, '__DEV__', { value: false, configurable: true });
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      logApiFailure('ctx', new Error('x'));
      expect(warn).not.toHaveBeenCalled();
    });

    it('warns with context when debug enabled', () => {
      process.env.EXPO_PUBLIC_API_DEBUG = '1';
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      logApiFailure('my-context', { message: 'fail' }, { id: 1 });
      expect(warn).toHaveBeenCalledWith(
        '[api]',
        'my-context',
        expect.objectContaining({ id: 1, axiosMessage: 'fail' }),
      );
    });
  });

  describe('logResolvedApiBaseUrl', () => {
    it('no-ops when debug disabled', () => {
      delete process.env.EXPO_PUBLIC_API_DEBUG;
      Object.defineProperty(globalThis, '__DEV__', { value: false, configurable: true });
      const log = jest.spyOn(console, 'log').mockImplementation(() => {});
      logResolvedApiBaseUrl('https://h');
      expect(log).not.toHaveBeenCalled();
    });
  });
});
