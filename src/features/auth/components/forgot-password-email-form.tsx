import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui';

import { AuthSingleFieldForm } from './auth-single-field-form';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length > 0 && EMAIL_REGEX.test(trimmed);
}

export type ForgotPasswordEmailFormProps = {
  email: string;
  onChangeEmail: (value: string) => void;
  onSubmit: () => Promise<void> | void;
  isSubmitting: boolean;
};

export function ForgotPasswordEmailForm({
  email,
  onChangeEmail,
  onSubmit,
  isSubmitting,
}: ForgotPasswordEmailFormProps) {
  const { t } = useTranslation();
  const isEmailValid = React.useMemo(() => isValidEmail(email), [email]);

  return (
    <AuthSingleFieldForm
      title={t('auth.forgot.title')}
      subtitle={t('auth.forgot.subtitle')}
      submitLabel={t('auth.forgot.submit')}
      onSubmit={onSubmit}
      loading={isSubmitting}
      disabled={!isEmailValid}
      submitTestID="forgot-email-submit"
      headerTestID="forgot-email-header"
    >
      <Input
        testID="forgot-email-input"
        label={t('auth.forgot.email_label')}
        placeholder={t('auth.forgot.email_placeholder')}
        value={email}
        onChangeText={onChangeEmail}
        type="email"
        isPassword={false}
      />
    </AuthSingleFieldForm>
  );
}
