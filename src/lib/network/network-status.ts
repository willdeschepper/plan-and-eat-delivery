import type { NetInfoState } from '@react-native-community/netinfo';
import NetInfo from '@react-native-community/netinfo';

/** Exported for tests and tuning; trailing debounce reduces LTE/Wi‑Fi flip-flop. */
export const NETWORK_DEBOUNCE_MS = 500;

let debouncedOnline = true;
const listeners = new Set<(online: boolean) => void>();
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
/** Last raw online value scheduled to apply after debounce. */
let pendingRaw: boolean | null = null;
let netInfoUnsub: (() => void) | null = null;
let startCount = 0;

/**
 * Connected to an interface AND not explicitly unreachable.
 * `isInternetReachable === null` = unknown → do not force offline if still connected.
 */
export function computeIsOnline(state: NetInfoState): boolean {
  if (!state.isConnected) {
    return false;
  }
  if (state.isInternetReachable === false) {
    return false;
  }
  return true;
}

function notifyListeners(online: boolean): void {
  listeners.forEach((listener) => {
    listener(online);
  });
}

function flushDebounced(): void {
  debounceTimer = null;
  if (pendingRaw === null) {
    return;
  }
  const next = pendingRaw;
  pendingRaw = null;
  if (next !== debouncedOnline) {
    debouncedOnline = next;
    notifyListeners(next);
  }
}

function scheduleDebounce(rawOnline: boolean): void {
  pendingRaw = rawOnline;
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(flushDebounced, NETWORK_DEBOUNCE_MS);
}

function handleNetInfoState(state: NetInfoState): void {
  scheduleDebounce(computeIsOnline(state));
}

/** Synchronous snapshot for Axios and non-React code (single source of truth). */
export function getIsOnline(): boolean {
  return debouncedOnline;
}

export function subscribe(listener: (online: boolean) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Idempotent ref-counted start for React Strict Mode.
 * First caller registers NetInfo; last caller clears timer and unsubscribes.
 */
export function startNetworkStatus(): () => void {
  startCount += 1;
  if (startCount === 1) {
    netInfoUnsub = NetInfo.addEventListener(handleNetInfoState);
    void NetInfo.fetch().then((state) => {
      scheduleDebounce(computeIsOnline(state));
    });
  }
  return () => {
    startCount -= 1;
    if (startCount === 0) {
      netInfoUnsub?.();
      netInfoUnsub = null;
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      pendingRaw = null;
    }
  };
}

/** Test-only full reset between cases. */
export function __resetNetworkStatusForTests(): void {
  listeners.clear();
  debouncedOnline = true;
  startCount = 0;
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  pendingRaw = null;
  if (netInfoUnsub !== null) {
    netInfoUnsub();
    netInfoUnsub = null;
  }
}
