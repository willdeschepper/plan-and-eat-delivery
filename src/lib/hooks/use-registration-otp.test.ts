import { act, renderHook } from '@testing-library/react-native';

import { showErrorMessage } from '@/components/ui/utils';
import { showParsedApiError } from '@/lib/api/errors';

import { useRegistrationOtp } from './use-registration-otp';

let mockVerifyAccount: jest.Mock;
let mockResendRegistrationOtp: jest.Mock;
let mockAssertOnline: jest.Mock;
let mockSignIn: jest.Mock;
let mockRouterReplace: jest.Mock;

jest.mock('expo-router', () => {
  mockRouterReplace = jest.fn();
  return {
    useRouter: () => ({ replace: mockRouterReplace }),
    useLocalSearchParams: () => ({ email: 'user@test.com' }),
  };
});

jest.mock('@/features/auth/api', () => {
  mockVerifyAccount = jest.fn();
  mockResendRegistrationOtp = jest.fn();
  return {
    useVerifyAccount: () => ({ mutateAsync: mockVerifyAccount }),
    useResendRegistrationOtp: () => ({ mutateAsync: mockResendRegistrationOtp }),
  };
});

jest.mock('@/lib/api/errors', () => ({
  showParsedApiError: jest.fn(),
}));

jest.mock('@/lib/network', () => {
  mockAssertOnline = jest.fn(() => true);
  return { assertOnline: () => mockAssertOnline() };
});

jest.mock('@/lib/api/log-registration-debug', () => ({
  logRegistrationFailure: jest.fn(),
  logRegistrationUnexpectedResponse: jest.fn(),
}));

jest.mock('@/components/ui/utils', () => ({
  showErrorMessage: jest.fn(),
}));

jest.mock('@/lib/hooks/use-auth-store', () => {
  mockSignIn = jest.fn();
  return { signIn: mockSignIn };
});

describe('useRegistrationOtp', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockAssertOnline.mockReset();
    mockAssertOnline.mockReturnValue(true);
    mockVerifyAccount.mockReset();
    mockResendRegistrationOtp.mockReset();
    mockSignIn.mockReset();
    mockRouterReplace.mockReset();
    mockVerifyAccount.mockResolvedValue({
      token: { access: 'a', refresh: 'r' },
    });
    mockResendRegistrationOtp.mockResolvedValue(undefined);
    (showParsedApiError as jest.Mock).mockClear();
    (showErrorMessage as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('handleSubmitOtp does nothing when otp too short', async () => {
    const { result } = renderHook(() => useRegistrationOtp());
    await act(async () => {
      result.current.setOtp('12');
    });
    await act(async () => {
      await result.current.handleSubmitOtp();
    });
    expect(mockVerifyAccount).not.toHaveBeenCalled();
  });

  it('handleSubmitOtp does nothing when offline', async () => {
    mockAssertOnline.mockReturnValue(false);
    const { result } = renderHook(() => useRegistrationOtp());
    await act(async () => {
      result.current.setOtp('123456');
    });
    await act(async () => {
      await result.current.handleSubmitOtp();
    });
    expect(mockVerifyAccount).not.toHaveBeenCalled();
  });

  it('handleSubmitOtp signs in and navigates on success', async () => {
    const { result } = renderHook(() => useRegistrationOtp());
    await act(async () => {
      result.current.setOtp('123456');
    });
    await act(async () => {
      await result.current.handleSubmitOtp();
    });
    expect(mockVerifyAccount).toHaveBeenCalledWith({
      email: 'user@test.com',
      code: '123456',
    });
    expect(mockSignIn).toHaveBeenCalledWith({ access: 'a', refresh: 'r' });
    expect(mockRouterReplace).toHaveBeenCalledWith('/registration-success');
  });

  it('handleSubmitOtp shows error when token missing', async () => {
    mockVerifyAccount.mockResolvedValueOnce({
      token: { access: '', refresh: '' },
    });
    const { result } = renderHook(() => useRegistrationOtp());
    await act(async () => {
      result.current.setOtp('123456');
    });
    await act(async () => {
      await result.current.handleSubmitOtp();
    });
    expect(showErrorMessage).toHaveBeenCalled();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('handleResend does nothing while countdown active', async () => {
    const { result } = renderHook(() => useRegistrationOtp());
    await act(async () => {
      await result.current.handleResend();
    });
    expect(mockResendRegistrationOtp).toHaveBeenCalled();
    mockResendRegistrationOtp.mockClear();
    await act(async () => {
      await result.current.handleResend();
    });
    expect(mockResendRegistrationOtp).not.toHaveBeenCalled();
  });

  it('formatResendTime formats seconds', () => {
    const { result } = renderHook(() => useRegistrationOtp());
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.formatResendTime()).toMatch(/^\d{2}:\d{2}$/);
  });
});
