import * as Location from 'expo-location';

import { getLocationResult } from './location';

jest.mock('expo-location', () => ({
  Accuracy: { Balanced: 3 },
  hasServicesEnabledAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

const mockLocation = Location as jest.Mocked<typeof Location>;

function makePosition(lat: number, lng: number) {
  return { coords: { latitude: lat, longitude: lng } } as Location.LocationObject;
}

describe('getLocationResult', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.hasServicesEnabledAsync.mockResolvedValue(true);
    mockLocation.requestForegroundPermissionsAsync.mockResolvedValue({
      status: 'granted',
      granted: true,
      canAskAgain: true,
      expires: 'never',
    });
    mockLocation.getLastKnownPositionAsync.mockResolvedValue(null);
    mockLocation.getCurrentPositionAsync.mockResolvedValue(
      makePosition(40.41, 49.87),
    );
  });

  it('returns coords on success', async () => {
    const result = await getLocationResult();
    expect(result.error).toBeNull();
    expect(result.coords).toEqual({ latitude: 40.41, longitude: 49.87 });
  });

  it('returns lastKnown when available before full fix', async () => {
    mockLocation.getLastKnownPositionAsync.mockResolvedValue(
      makePosition(40.40, 49.86),
    );
    const result = await getLocationResult();
    expect(result.lastKnown).toEqual({ latitude: 40.40, longitude: 49.86 });
    expect(result.coords).toEqual({ latitude: 40.41, longitude: 49.87 });
  });

  it('returns services_disabled when location services are off', async () => {
    mockLocation.hasServicesEnabledAsync.mockResolvedValue(false);
    const result = await getLocationResult();
    expect(result.error).toBe('services_disabled');
    expect(result.coords).toBeNull();
    expect(result.lastKnown).toBeNull();
    expect(mockLocation.requestForegroundPermissionsAsync).not.toHaveBeenCalled();
  });

  it('returns permission_denied when permission is not granted', async () => {
    mockLocation.requestForegroundPermissionsAsync.mockResolvedValue({
      status: 'denied',
      granted: false,
      canAskAgain: false,
      expires: 'never',
    });
    const result = await getLocationResult();
    expect(result.error).toBe('permission_denied');
    expect(result.coords).toBeNull();
    expect(mockLocation.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  it('returns timeout when getCurrentPositionAsync takes too long', async () => {
    jest.useFakeTimers();
    mockLocation.getCurrentPositionAsync.mockImplementation(
      () => new Promise<never>(() => {}),
    );

    const promise = getLocationResult();
    jest.advanceTimersByTime(11_000);
    // Flush microtasks/macrotasks so the race resolves
    await jest.runAllTimersAsync();
    const result = await promise;

    expect(result.error).toBe('timeout');
    expect(result.coords).toBeNull();
    jest.useRealTimers();
  }, 15_000);

  it('returns unknown on unexpected error from getCurrentPositionAsync', async () => {
    mockLocation.getCurrentPositionAsync.mockRejectedValue(
      new Error('some native error'),
    );
    const result = await getLocationResult();
    expect(result.error).toBe('unknown');
    expect(result.coords).toBeNull();
  });

  it('tolerates getLastKnownPositionAsync failure and continues', async () => {
    mockLocation.getLastKnownPositionAsync.mockRejectedValue(
      new Error('not available'),
    );
    const result = await getLocationResult();
    expect(result.lastKnown).toBeNull();
    expect(result.error).toBeNull();
    expect(result.coords).toEqual({ latitude: 40.41, longitude: 49.87 });
  });
});
