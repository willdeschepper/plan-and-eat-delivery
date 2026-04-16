import { renderHook } from '@testing-library/react-native';

import { useSignUpFormValidators } from './use-sign-up-form-validators';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

describe('useSignUpFormValidators', () => {
  it('validateName fails for short name', () => {
    const { result } = renderHook(() => useSignUpFormValidators());
    expect(result.current.validateName({ value: 'a' })).toBe(
      'auth.validation.name_min_length',
    );
  });

  it('validateName passes for adequate length', () => {
    const { result } = renderHook(() => useSignUpFormValidators());
    expect(result.current.validateName({ value: 'Jo' })).toBeUndefined();
  });

  it('validateEmail fails for invalid format', () => {
    const { result } = renderHook(() => useSignUpFormValidators());
    expect(result.current.validateEmail({ value: 'not-an-email' })).toBe(
      'auth.validation.email_invalid',
    );
  });

  it('validateEmail passes for valid email', () => {
    const { result } = renderHook(() => useSignUpFormValidators());
    expect(
      result.current.validateEmail({ value: 'a@b.co' }),
    ).toBeUndefined();
  });

  it('validateConfirmPassword detects mismatch', () => {
    const { result } = renderHook(() => useSignUpFormValidators());
    expect(
      result.current.validateConfirmPassword({ value: 'x' }, 'y'),
    ).toBe('auth.validation.confirm_password_mismatch');
  });

  it('validatePhone requires non-empty', () => {
    const { result } = renderHook(() => useSignUpFormValidators());
    expect(result.current.validatePhone({ value: '   ' })).toBe(
      'auth.validation.phone_required',
    );
  });
});
