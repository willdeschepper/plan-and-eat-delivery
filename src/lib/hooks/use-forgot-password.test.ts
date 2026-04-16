/* eslint-disable max-lines-per-function */
import { act, renderHook } from '@testing-library/react-native';

import { showErrorMessage } from '@/components/ui/utils';
import { showParsedApiError } from '@/lib/api/errors';

import { useForgotPassword } from './use-forgot-password';

let mockRequestForgot: jest.Mock;
let mockVerifyForgot: jest.Mock;
let mockSetPassword: jest.Mock;
let mockAssertOnline: jest.Mock;
let mockSignIn: jest.Mock;
let mockRouterReplace: jest.Mock;

jest.mock('expo-router', () => {
  mockRouterReplace = jest.fn();
  return {
    useRouter: () => ({ replace: mockRouterReplace }),
  };
});

jest.mock('@/features/auth/api', () => {
  mockRequestForgot = jest.fn();
  mockVerifyForgot = jest.fn();
  mockSetPassword = jest.fn();
  return {
    useForgotPasswordRequest: () => ({ mutateAsync: mockRequestForgot }),
    useVerifyForgotPassword: () => ({ mutateAsync: mockVerifyForgot }),
    useSetPassword: () => ({ mutateAsync: mockSetPassword }),
  };
});

jest.mock('@/lib/api/errors', () => ({
  showParsedApiError: jest.fn(),
}));

jest.mock('@/lib/network', () => {
  mockAssertOnline = jest.fn(() => true);
  return { assertOnline: () => mockAssertOnline() };
});

jest.mock('@/components/ui/utils', () => ({
  showErrorMessage: jest.fn(),
}));

jest.mock('@/lib/hooks/use-auth-store', () => {
  mockSignIn = jest.fn();
  return { signIn: mockSignIn };
});

describe('useForgotPassword', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockAssertOnline.mockReset();
    mockAssertOnline.mockReturnValue(true);
    mockRequestForgot.mockReset();
    mockVerifyForgot.mockReset();
    mockSetPassword.mockReset();
    mockSignIn.mockReset();
    mockRouterReplace.mockReset();
    mockRequestForgot.mockResolvedValue(undefined);
    mockVerifyForgot.mockResolvedValue({
      token: { access: 'a', refresh: 'r' },
    });
    mockSetPassword.mockResolvedValue(undefined);
    (showParsedApiError as jest.Mock).mockClear();
    (showErrorMessage as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('handleSubmitEmail does nothing when email is blank', async () => {
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      await result.current.handleSubmitEmail();
    });
    expect(mockRequestForgot).not.toHaveBeenCalled();
  });

  it('handleSubmitEmail does nothing when offline', async () => {
    mockAssertOnline.mockReturnValue(false);
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      result.current.setEmail('a@b.com');
    });
    await act(async () => {
      await result.current.handleSubmitEmail();
    });
    expect(mockRequestForgot).not.toHaveBeenCalled();
  });

  it('handleSubmitEmail moves to otp and starts resend countdown', async () => {
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      result.current.setEmail('a@b.com');
    });
    await act(async () => {
      await result.current.handleSubmitEmail();
    });
    expect(mockRequestForgot).toHaveBeenCalledWith({ email: 'a@b.com' });
    expect(result.current.step).toBe('otp');
    expect(result.current.resendSeconds).toBe(90);
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current.resendSeconds).toBe(89);
  });

  it('handleSubmitOtp does nothing when code too short', async () => {
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      result.current.setOtp('12');
    });
    await act(async () => {
      await result.current.handleSubmitOtp();
    });
    expect(mockVerifyForgot).not.toHaveBeenCalled();
  });

  it('handleSubmitOtp signs in and moves to reset on valid token', async () => {
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      result.current.setEmail('a@b.com');
      result.current.setOtp('123456');
    });
    await act(async () => {
      await result.current.handleSubmitOtp();
    });
    expect(mockVerifyForgot).toHaveBeenCalledWith({
      email: 'a@b.com',
      code: '123456',
    });
    expect(mockSignIn).toHaveBeenCalledWith({ access: 'a', refresh: 'r' });
    expect(result.current.step).toBe('reset');
  });

  it('handleSubmitOtp shows error when token missing in response', async () => {
    mockVerifyForgot.mockResolvedValueOnce({ token: { access: '', refresh: '' } });
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      result.current.setEmail('a@b.com');
      result.current.setOtp('123456');
    });
    await act(async () => {
      await result.current.handleSubmitOtp();
    });
    expect(showErrorMessage).toHaveBeenCalled();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('handleSubmitReset does nothing when passwords mismatch', async () => {
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      result.current.setPassword('a');
      result.current.setConfirmPassword('b');
    });
    await act(async () => {
      await result.current.handleSubmitReset();
    });
    expect(mockSetPassword).not.toHaveBeenCalled();
  });

  it('handleSubmitReset calls API and navigates on success', async () => {
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      result.current.setPassword('secret');
      result.current.setConfirmPassword('secret');
    });
    await act(async () => {
      await result.current.handleSubmitReset();
    });
    expect(mockSetPassword).toHaveBeenCalledWith({
      password: 'secret',
      password2: 'secret',
    });
    expect(mockRouterReplace).toHaveBeenCalledWith('/password-changed-success');
  });

  it('handleResendCode does nothing while countdown active', async () => {
    const { result } = renderHook(() => useForgotPassword());
    await act(async () => {
      result.current.setEmail('a@b.com');
    });
    await act(async () => {
      await result.current.handleSubmitEmail();
    });
    mockRequestForgot.mockClear();
    await act(async () => {
      await result.current.handleResendCode();
    });
    expect(mockRequestForgot).not.toHaveBeenCalled();
  });
});
