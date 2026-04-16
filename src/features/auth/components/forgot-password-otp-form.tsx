import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { OtpForm } from './otp-form';

export type ForgotPasswordOtpFormProps = {
  email: string;
  otp: string;
  onChangeOtp: (value: string) => void;
  onSubmit: () => Promise<void> | void;
  isSubmitting: boolean;
  resendSeconds: number;
  onChangeEmail: () => void;
  onResend: () => void;
  formatResendTime: () => string;
};

export function ForgotPasswordOtpForm({
  email,
  otp,
  onChangeOtp,
  onSubmit,
  isSubmitting,
  resendSeconds,
  onResend,
  formatResendTime,
}: ForgotPasswordOtpFormProps) {
  const { t } = useTranslation();

  return (
    <OtpForm
      title={t('auth.otp.forgot_title')}
      subtitle={t('auth.otp.forgot_subtitle', { email })}
      submitLabel={t('auth.forgot.otp_submit')}
      resendLabel={t('auth.forgot.resend_code')}
      otp={otp}
      onChangeOtp={onChangeOtp}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      resendSeconds={resendSeconds}
      onResend={onResend}
      formatResendTime={formatResendTime}
    />
  );
}
