import * as logApiDebug from '@/lib/api/log-api-debug';

import {
  logRegistrationFailure,
  logRegistrationUnexpectedResponse,
} from './log-registration-debug';

describe('log-registration-debug', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('delegates logRegistrationFailure to logApiFailure with step prefix', () => {
    const spy = jest.spyOn(logApiDebug, 'logApiFailure').mockImplementation(() => {});
    const err = new Error('e');
    logRegistrationFailure('verify', err);
    expect(spy).toHaveBeenCalledWith('registration:verify', err);
  });

  it('logs unexpected payload when API debug enabled', () => {
    jest.spyOn(logApiDebug, 'isApiDebugEnabled').mockReturnValue(true);
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logRegistrationUnexpectedResponse('register', { a: 1 }, 'no tokens');
    expect(warn).toHaveBeenCalledWith(
      '[registration]',
      'register: unexpected response',
      expect.objectContaining({
        hint: 'no tokens',
        topLevelKeys: ['a'],
        payload: { a: 1 },
      }),
    );
  });

  it('skips unexpected response log when debug disabled', () => {
    jest.spyOn(logApiDebug, 'isApiDebugEnabled').mockReturnValue(false);
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    logRegistrationUnexpectedResponse('verify', {}, 'x');
    expect(warn).not.toHaveBeenCalled();
  });
});
