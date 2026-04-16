/* eslint-disable import/first -- jest.mock must precede the module-under-test import */
import type { NetInfoState } from '@react-native-community/netinfo';

const mockAddEventListener = jest.fn();
const mockFetch = jest.fn();

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    addEventListener: (handler: (s: NetInfoState) => void) => {
      mockAddEventListener(handler);
      return jest.fn();
    },
    fetch: () => mockFetch(),
  },
}));

import {
  __resetNetworkStatusForTests,
  computeIsOnline,
  getIsOnline,
  NETWORK_DEBOUNCE_MS,
  startNetworkStatus,
  subscribe,
} from './network-status';

describe('computeIsOnline', () => {
  it('returns false when not connected', () => {
    expect(
      computeIsOnline({
        type: 'none',
        isConnected: false,
        isInternetReachable: false,
      } as NetInfoState),
    ).toBe(false);
  });

  it('returns false when connected but internet explicitly unreachable', () => {
    expect(
      computeIsOnline({
        type: 'wifi',
        isConnected: true,
        isInternetReachable: false,
      } as NetInfoState),
    ).toBe(false);
  });

  it('returns true when connected and reachability unknown (null)', () => {
    expect(
      computeIsOnline({
        type: 'wifi',
        isConnected: true,
        isInternetReachable: null,
      } as NetInfoState),
    ).toBe(true);
  });

  it('returns true when connected and internet reachable', () => {
    expect(
      computeIsOnline({
        type: 'wifi',
        isConnected: true,
        isInternetReachable: true,
      } as NetInfoState),
    ).toBe(true);
  });
});

describe('network-status debounce and subscribe', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    __resetNetworkStatusForTests();
    mockAddEventListener.mockClear();
    mockFetch.mockResolvedValue({
      type: 'wifi',
      isConnected: true,
      isInternetReachable: true,
    } as NetInfoState);
  });

  afterEach(() => {
    jest.useRealTimers();
    __resetNetworkStatusForTests();
  });

  it('notifies subscribers after debounce when state goes offline', () => {
    let netHandler: ((s: NetInfoState) => void) | undefined;
    mockAddEventListener.mockImplementation((handler: (s: NetInfoState) => void) => {
      netHandler = handler;
      return jest.fn();
    });

    const received: boolean[] = [];
    const stop = startNetworkStatus();
    const unsub = subscribe((online) => {
      received.push(online);
    });

    expect(mockAddEventListener).toHaveBeenCalledTimes(1);
    expect(netHandler).toBeDefined();

    netHandler?.({
      type: 'none',
      isConnected: false,
      isInternetReachable: false,
    } as NetInfoState);

    expect(getIsOnline()).toBe(true);
    jest.advanceTimersByTime(NETWORK_DEBOUNCE_MS);
    expect(getIsOnline()).toBe(false);
    expect(received).toEqual([false]);

    unsub();
    stop();
  });

  it('delivers the same transitions to multiple subscribers', () => {
    let netHandler: ((s: NetInfoState) => void) | undefined;
    mockAddEventListener.mockImplementation((handler: (s: NetInfoState) => void) => {
      netHandler = handler;
      return jest.fn();
    });

    const a: boolean[] = [];
    const b: boolean[] = [];
    const stop = startNetworkStatus();
    subscribe((online) => {
      a.push(online);
    });
    subscribe((online) => {
      b.push(online);
    });

    netHandler?.({
      type: 'none',
      isConnected: false,
      isInternetReachable: false,
    } as NetInfoState);
    jest.advanceTimersByTime(NETWORK_DEBOUNCE_MS);

    expect(a).toEqual([false]);
    expect(b).toEqual([false]);

    stop();
  });
});
