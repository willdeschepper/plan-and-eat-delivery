import { useLocalSearchParams, useRouter } from 'expo-router';

import * as React from 'react';
import { showErrorMessage } from '@/components/ui/utils';
import { useResendRegistrationOtp, useVerifyAccount } from '@/features/auth/api';
import { showParsedApiError } from '@/lib/api/errors';
import {
  logRegistrationFailure,
  logRegistrationUnexpectedResponse,
} from '@/lib/api/log-registration-debug';
import { assertOnline } from '@/lib/network';
import { signIn } from './use-auth-store';

const RESEND_TIMEOUT = 90;

export function useRegistrationOtp() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = params.email ?? '';

  const [otp, setOtp] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [resendSeconds, setResendSeconds] = React.useState(0);
  const [hasError, setHasError] = React.useState(false);

  const { mutateAsync: verifyAccount } = useVerifyAccount();
  const { mutateAsync: resendRegistrationOtp } = useResendRegistrationOtp();

  React.useEffect(() => {
    if (resendSeconds <= 0)
      return;
    const interval = setInterval(() => {
      setResendSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendSeconds]);

  const handleSubmitOtp = React.useCallback(async () => {
    if (!email.trim() || otp.length < 6)
      return;

    if (!assertOnline()) {
      return;
    }

    setIsSubmitting(true);
    setHasError(false);

    try {
      const response = await verifyAccount({
        email,
        code: otp,
      });

      if (!response?.token?.access || !response?.token?.refresh) {
        logRegistrationUnexpectedResponse(
          'verify',
          response,
          'Expected token.access and token.refresh (see Plan&Eat verify response)',
        );
        setHasError(true);
        showErrorMessage('Invalid verification response. Please try again.');
        return;
      }

      await signIn({
        access: response.token.access,
        refresh: response.token.refresh,
      });
      router.replace('/registration-success');
    }
    catch (error) {
      logRegistrationFailure('verify', error);
      setHasError(true);
      showParsedApiError(error);
    }
    finally {
      setIsSubmitting(false);
    }
  }, [email, otp, router, verifyAccount]);

  const handleResend = React.useCallback(async () => {
    if (resendSeconds > 0 || !email.trim())
      return;

    if (!assertOnline()) {
      return;
    }

    try {
      await resendRegistrationOtp({ email });
      setResendSeconds(RESEND_TIMEOUT);
    }
    catch (error) {
      logRegistrationFailure('resend-otp', error);
      showParsedApiError(error);
    }
  }, [email, resendRegistrationOtp, resendSeconds]);

  const formatResendTime = React.useCallback(() => {
    const minutes = Math.floor(resendSeconds / 60);
    const seconds = resendSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [resendSeconds]);

  return {
    email,
    otp,
    setOtp,
    isSubmitting,
    resendSeconds,
    hasError,
    handleSubmitOtp,
    handleResend,
    formatResendTime,
  };
}
