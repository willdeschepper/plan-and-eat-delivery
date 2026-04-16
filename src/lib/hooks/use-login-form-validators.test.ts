import { renderHook } from '@testing-library/react-native';

import { useLoginFormValidators } from './use-login-form-validators';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

describe('useLoginFormValidators', () => {
  it('validateNumber returns message when empty', () => {
    const { result } = renderHook(() => useLoginFormValidators());
    expect(result.current.validateNumber({ value: '' })).toBe(
      'auth.validation.number_required',
    );
  });

  it('validateNumber returns undefined when non-empty', () => {
    const { result } = renderHook(() => useLoginFormValidators());
    expect(result.current.validateNumber({ value: '+123' })).toBeUndefined();
  });

  it('validatePassword returns message when too short', () => {
    const { result } = renderHook(() => useLoginFormValidators());
    expect(result.current.validatePassword({ value: '12345' })).toBe(
      'auth.validation.password_min_length',
    );
  });

  it('validatePassword returns undefined when valid length', () => {
    const { result } = renderHook(() => useLoginFormValidators());
    expect(result.current.validatePassword({ value: '123456' })).toBeUndefined();
  });
});
