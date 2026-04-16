import { isApiDebugEnabled, logApiFailure } from '@/lib/api/log-api-debug';

const TAG = '[registration]';

/**
 * Registration-step failures; delegates to shared API logger (prefix `registration:*`).
 */
export function logRegistrationFailure(
  step: 'register' | 'verify' | 'resend-otp',
  error: unknown,
): void {
  logApiFailure(`registration:${step}`, error);
}

/**
 * Logs when the server returned 200 but the payload does not match the expected shape (e.g. tokens).
 */
export function logRegistrationUnexpectedResponse(
  step: 'register' | 'verify',
  payload: unknown,
  hint: string,
): void {
  if (!isApiDebugEnabled())
    return;

  const keys
    = payload !== null && typeof payload === 'object'
      ? Object.keys(payload as Record<string, unknown>)
      : [];

  console.warn(TAG, `${step}: unexpected response`, {
    hint,
    topLevelKeys: keys,
    payload,
  });
}
