import type { AxiosError } from 'axios';
import axios from 'axios';

import { showErrorMessage } from '@/components/ui/utils';
import { logApiFailure } from '@/lib/api/log-api-debug';
import { translate } from '@/lib/i18n/utils';
import { getIsOnline } from '@/lib/network/network-status';

export const GENERAL_ERROR_FALLBACK = 'Unexpected error, please try again.';

type StandardizedErrorItem = {
  code: string;
  detail: string;
  attr: string | null;
};

type ErrorResponse = {
  type: string;
  errors: StandardizedErrorItem[];
};

export type ParsedApiError = {
  fieldErrors: Record<string, string>;
  /** Errors not tied to a specific field (`attr` null/absent). */
  generalError?: string;
};

export function getErrorResponse(error: unknown): ErrorResponse | null {
  const axiosError = error as AxiosError | undefined;
  const data = axiosError?.response?.data as ErrorResponse | undefined;

  if (!data || !Array.isArray(data.errors)) {
    return null;
  }

  return data;
}

export function parseApiError(error: unknown): ParsedApiError {
  const response = getErrorResponse(error);

  if (!response) {
    logApiFailure('parseApiError_unhandled_shape', error, {
      hint:
        'Response is not Plan&Eat ErrorResponse (expected { type, errors: array }). '
        + 'Check [api] axios_response_error above for httpStatus and responseData.',
    });
    return {
      fieldErrors: {},
      generalError: GENERAL_ERROR_FALLBACK,
    };
  }

  const fieldErrors: Record<string, string> = {};
  let generalError: string | undefined;

  for (const item of response.errors) {
    if (item.attr) {
      if (!fieldErrors[item.attr]) {
        fieldErrors[item.attr] = item.detail;
      }
    }
    else if (!generalError) {
      generalError = item.detail;
    }
  }

  return {
    fieldErrors,
    generalError,
  };
}

/**
 * Single user-facing string for toasts/alerts: general errors first, then field errors, then fallback.
 */
export function formatApiErrorForUser(parsed: ParsedApiError): string {
  if (parsed.generalError)
    return parsed.generalError;

  const fieldMessages = Object.values(parsed.fieldErrors).filter(Boolean);
  if (fieldMessages.length > 0)
    return fieldMessages.join('\n');

  return GENERAL_ERROR_FALLBACK;
}

/** No HTTP response — transport failure, timeout, or offline (M1-D). */
export function isAxiosNetworkError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }
  return error.response === undefined;
}

/** For local/non-API errors (e.g. push token failures): show error.message, or a safe fallback. */
export function showLocalError(
  error: unknown,
  fallback: string = GENERAL_ERROR_FALLBACK,
): void {
  const message
    = error instanceof Error && error.message ? error.message : fallback;
  showErrorMessage(message);
}

export function showParsedApiError(error: unknown): void {
  if (isAxiosNetworkError(error)) {
    if (!getIsOnline()) {
      return;
    }
    showErrorMessage(translate('network.load_failed'));
    return;
  }
  showErrorMessage(formatApiErrorForUser(parseApiError(error)));
}
