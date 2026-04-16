import {
  formatApiErrorForUser,
  getErrorResponse,
  isAxiosNetworkError,
  parseApiError,
  showParsedApiError,
} from './errors';

jest.mock('@/components/ui/utils', () => ({
  showErrorMessage: jest.fn(),
}));

jest.mock('@/lib/api/log-api-debug', () => ({
  logApiFailure: jest.fn(),
}));

jest.mock('@/lib/i18n/utils', () => ({
  translate: jest.fn((key: string) => key),
}));

jest.mock('@/lib/network/network-status', () => ({
  getIsOnline: jest.fn(() => true),
}));

const { showErrorMessage } = jest.requireMock('@/components/ui/utils') as {
  showErrorMessage: jest.Mock;
};
const { logApiFailure } = jest.requireMock('@/lib/api/log-api-debug') as {
  logApiFailure: jest.Mock;
};
const { getIsOnline } = jest.requireMock('@/lib/network/network-status') as {
  getIsOnline: jest.Mock;
};

function axiosErr(data?: unknown, responseUndefined = false): AxiosError {
  const err = new Error('req') as AxiosError;
  err.isAxiosError = true;
  if (responseUndefined) {
    err.response = undefined;
  }
  else {
    err.response = {
      data,
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as AxiosError['config'],
    };
  }
  return err;
}

describe('getErrorResponse', () => {
  it('returns null for non-axios or missing data', () => {
    expect(getErrorResponse(null)).toBeNull();
    expect(getErrorResponse({})).toBeNull();
  });

  it('returns null when errors is not an array', () => {
    const err = axiosErr({ type: 'x', errors: {} });
    expect(getErrorResponse(err)).toBeNull();
  });

  it('returns parsed body when shape is valid', () => {
    const body = {
      type: 'validation_error',
      errors: [{ code: '1', detail: 'bad', attr: 'email' }],
    };
    expect(getErrorResponse(axiosErr(body))).toEqual(body);
  });
});

describe('parseApiError', () => {
  beforeEach(() => {
    logApiFailure.mockClear();
  });

  it('returns fallback and logs when response shape is invalid', () => {
    const err = axiosErr({ foo: 1 });
    expect(parseApiError(err)).toEqual({
      fieldErrors: {},
      generalError: 'Unexpected error, please try again.',
    });
    expect(logApiFailure).toHaveBeenCalledWith(
      'parseApiError_unhandled_shape',
      err,
      expect.objectContaining({ hint: expect.stringContaining('Plan&Eat') }),
    );
  });

  it('maps attr errors to fieldErrors and keeps first per field', () => {
    const err = axiosErr({
      type: 'x',
      errors: [
        { code: 'a', detail: 'first email', attr: 'email' },
        { code: 'b', detail: 'ignored', attr: 'email' },
        { code: 'c', detail: 'pwd bad', attr: 'password' },
      ],
    });
    expect(parseApiError(err)).toEqual({
      fieldErrors: { email: 'first email', password: 'pwd bad' },
      generalError: undefined,
    });
    expect(logApiFailure).not.toHaveBeenCalled();
  });

  it('uses first general error when attr is null', () => {
    const err = axiosErr({
      type: 'x',
      errors: [
        { code: 'g', detail: 'General one', attr: null },
        { code: 'h', detail: 'General two', attr: null },
      ],
    });
    expect(parseApiError(err)).toEqual({
      fieldErrors: {},
      generalError: 'General one',
    });
  });
});

describe('formatApiErrorForUser', () => {
  it('prefers generalError', () => {
    expect(
      formatApiErrorForUser({
        fieldErrors: { a: 'x' },
        generalError: 'G',
      }),
    ).toBe('G');
  });

  it('joins field errors when no general', () => {
    expect(
      formatApiErrorForUser({
        fieldErrors: { a: 'one', b: 'two' },
      }),
    ).toBe('one\ntwo');
  });

  it('returns fallback when empty', () => {
    expect(formatApiErrorForUser({ fieldErrors: {} })).toBe(
      'Unexpected error, please try again.',
    );
  });
});

describe('isAxiosNetworkError', () => {
  it('returns false for non-axios', () => {
    expect(isAxiosNetworkError(new Error('x'))).toBe(false);
  });

  it('returns true when axios error has no response', () => {
    expect(isAxiosNetworkError(axiosErr(undefined, true))).toBe(true);
  });

  it('returns false when response exists', () => {
    expect(isAxiosNetworkError(axiosErr({ errors: [] }))).toBe(false);
  });
});

describe('showParsedApiError', () => {
  beforeEach(() => {
    showErrorMessage.mockClear();
    getIsOnline.mockReturnValue(true);
  });

  it('does nothing when network error and offline', () => {
    getIsOnline.mockReturnValue(false);
    showParsedApiError(axiosErr(undefined, true));
    expect(showErrorMessage).not.toHaveBeenCalled();
  });

  it('shows translated load_failed when network error and online', () => {
    showParsedApiError(axiosErr(undefined, true));
    expect(showErrorMessage).toHaveBeenCalledWith('network.load_failed');
  });

  it('parses API error for non-network axios errors', () => {
    const err = axiosErr({
      type: 'x',
      errors: [{ code: '1', detail: 'Oops', attr: null }],
    });
    showParsedApiError(err);
    expect(showErrorMessage).toHaveBeenCalledWith('Oops');
  });
});
