import { getFieldError } from './form-utils';

describe('getFieldError', () => {
  it('returns undefined when errors array is empty', () => {
    const field = {
      state: {
        meta: {
          errors: [],
        },
      },
    };
    expect(getFieldError(field)).toBeUndefined();
  });

  it('returns the string when error is a string', () => {
    const field = {
      state: {
        meta: {
          errors: ['Required field'],
        },
      },
    };
    expect(getFieldError(field)).toBe('Required field');
  });

  it('returns message when error is object with message (Zod)', () => {
    const field = {
      state: {
        meta: {
          errors: [{ message: 'Invalid email format' }],
        },
      },
    };
    expect(getFieldError(field)).toBe('Invalid email format');
  });

  it('converts other error types to string', () => {
    const field = {
      state: {
        meta: {
          errors: [123],
        },
      },
    };
    expect(getFieldError(field)).toBe('123');
  });
});
