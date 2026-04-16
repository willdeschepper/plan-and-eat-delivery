import * as Location from 'expo-location';

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type LocationErrorCode
  = | 'timeout'
    | 'permission_denied'
    | 'services_disabled'
    | 'unknown';

export type LocationResult = {
  /** Accurate position — null when unavailable or error. */
  coords: LatLng | null;
  /** Quick approximate position from last known fix — used for fast map centering. */
  lastKnown: LatLng | null;
  error: LocationErrorCode | null;
};

const LOCATION_TIMEOUT_MS = 10_000;

class LocationTimeoutError extends Error {
  constructor() {
    super('location_timeout');
    this.name = 'LocationTimeoutError';
  }
}

function toLatLng(pos: Location.LocationObject): LatLng {
  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}

/**
 * Full location request: checks OS services, requests permission,
 * uses Accuracy.Balanced with 10s timeout. Returns typed result
 * so callers can show the right UX per error code (M3-A, M3-G).
 */
export async function getLocationResult(): Promise<LocationResult> {
  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    return { coords: null, lastKnown: null, error: 'services_disabled' };
  }

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return { coords: null, lastKnown: null, error: 'permission_denied' };
  }

  let lastKnown: LatLng | null = null;
  try {
    const lk = await Location.getLastKnownPositionAsync();
    if (lk)
      lastKnown = toLatLng(lk);
  }
  catch {
    // last known is best-effort; ignore errors
  }

  try {
    const pos = await Promise.race<Location.LocationObject>([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new LocationTimeoutError()), LOCATION_TIMEOUT_MS),
      ),
    ]);
    return { coords: toLatLng(pos), lastKnown, error: null };
  }
  catch (err) {
    const errorCode: LocationErrorCode
      = err instanceof LocationTimeoutError ? 'timeout' : 'unknown';
    return { coords: null, lastKnown, error: errorCode };
  }
}

// ---------------------------------------------------------------------------
// Legacy helpers — kept for backward compatibility with existing call sites.
// Prefer getLocationResult() for new code.
// ---------------------------------------------------------------------------

/** @deprecated Use getLocationResult() */
export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

/** @deprecated Use getLocationResult() */
export async function getCurrentLocation(): Promise<LatLng | null> {
  const result = await getLocationResult();
  return result.coords;
}
