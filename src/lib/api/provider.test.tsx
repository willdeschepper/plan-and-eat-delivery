import * as React from 'react';
import { Text } from 'react-native';

import { startNetworkStatus } from '@/lib/network/network-status';

import { cleanup, render, screen } from '@/lib/test-utils';

import { APIProvider } from './provider';

jest.mock('@dev-plugins/react-query', () => ({
  useReactQueryDevTools: jest.fn(),
}));

let networkStatusTestMocks: {
  stop: jest.Mock;
  subscribe: jest.Mock;
};

jest.mock('@/lib/network/network-status', () => {
  const stop = jest.fn();
  const subscribe = jest.fn(() => jest.fn());
  networkStatusTestMocks = { stop, subscribe };
  return {
    getIsOnline: jest.fn(() => true),
    startNetworkStatus: jest.fn(() => stop),
    subscribe,
  };
});

afterEach(cleanup);

describe('aPIProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children inside QueryClientProvider', () => {
    render(
      <APIProvider>
        <Text testID="api-child">child</Text>
      </APIProvider>,
    );
    expect(screen.getByTestId('api-child')).toBeOnTheScreen();
  });

  it('starts network status on mount and runs cleanup on unmount', () => {
    const { unmount } = render(
      <APIProvider>
        <Text>x</Text>
      </APIProvider>,
    );
    expect(jest.mocked(startNetworkStatus)).toHaveBeenCalled();
    unmount();
    expect(networkStatusTestMocks.stop).toHaveBeenCalled();
  });

  it('subscribes to network updates for online manager and invalidation', () => {
    render(
      <APIProvider>
        <Text>x</Text>
      </APIProvider>,
    );
    expect(networkStatusTestMocks.subscribe.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
});
