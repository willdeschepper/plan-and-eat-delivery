import { useRouter } from 'expo-router';

import * as React from 'react';
import { showErrorMessage } from '@/components/ui/utils';
import {
  useForgotPasswordRequest,
  useSetPassword,
  useVerifyForgotPassword,
} from '@/features/auth/api';
import { showParsedApiError } from '@/lib/api/errors';
import { assertOnline } from '@/lib/network';
import { signIn } from './use-auth-store';

type Step = 'email' | 'otp' | 'reset';

const RESEND_TIMEOUT = 90;

function formatResendClock(resendSeconds: number): string {
  const minutes = Math.floor(resendSeconds / 60);
  const seconds = resendSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// eslint-disable-next-line max-lines-per-function -- multi-step forgot-password (email, OTP, reset, resend)
export function useForgotPassword() {
  const router = useRouter();
  const [step, setStep] = React.useState<Step>('email');
  const [email, setEmail] = React.useState<string>('');
  const [otp, setOtp] = React.useState<string>('');
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [resendSeconds, setResendSeconds] = React.useState<number>(0);
  const [password, setPassword] = React.useState<string>('');
  const [confirmPassword, setConfirmPassword] = React.useState<string>('');

  const { mutateAsync: requestForgotPassword } = useForgotPasswordRequest();
  const { mutateAsync: verifyForgotPassword } = useVerifyForgotPassword();
  const { mutateAsync: setPasswordMutation } = useSetPassword();

  React.useEffect(() => {
    if (step !== 'otp' || resendSeconds <= 0)
      return;

    const interval = setInterval(() => {
      setResendSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [step, resendSeconds]);

  const handleSubmitEmail = React.useCallback(async () => {
    if (!email.trim())
      return;

    if (!assertOnline()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await requestForgotPassword({ email });
      setStep('otp');
      setResendSeconds(RESEND_TIMEOUT);
    }
    catch (error) {
      showParsedApiError(error);
    }
    finally {
      setIsSubmitting(false);
    }
  }, [email, requestForgotPassword]);

  const handleSubmitOtp = React.useCallback(async () => {
    if (otp.length < 6)
      return;

    if (!assertOnline()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyForgotPassword({
        email,
        code: otp,
      });

      if (!response?.token?.access || !response?.token?.refresh) {
        showErrorMessage('Invalid verification response. Please try again.');
        return;
      }

      await signIn({
        access: response.token.access,
        refresh: response.token.refresh,
      });
      setStep('reset');
    }
    catch (error) {
      showParsedApiError(error);
    }
    finally {
      setIsSubmitting(false);
    }
  }, [email, otp, verifyForgotPassword]);

  const handleSubmitReset = React.useCallback(async () => {
    if (!password.trim() || !confirmPassword.trim() || password !== confirmPassword)
      return;

    if (!assertOnline()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await setPasswordMutation({
        password,
        password2: confirmPassword,
      });
      router.replace('/password-changed-success');
    }
    catch (error) {
      showParsedApiError(error);
    }
    finally {
      setIsSubmitting(false);
    }
  }, [confirmPassword, password, router, setPasswordMutation]);

  const handleResendCode = React.useCallback(async () => {
    if (resendSeconds > 0)
      return;

    if (!assertOnline()) {
      return;
    }

    try {
      await requestForgotPassword({ email });
      setResendSeconds(RESEND_TIMEOUT);
    }
    catch (error) {
      showParsedApiError(error);
    }
  }, [email, requestForgotPassword, resendSeconds]);

  const formatResendTime = React.useCallback(
    () => formatResendClock(resendSeconds),
    [resendSeconds],
  );

  return {
    step,
    email,
    otp,
    password,
    confirmPassword,
    isSubmitting,
    resendSeconds,
    setStep,
    setEmail,
    setOtp,
    setPassword,
    setConfirmPassword,
    handleSubmitEmail,
    handleSubmitOtp,
    handleSubmitReset,
    handleResendCode,
    formatResendTime,
  };
}
