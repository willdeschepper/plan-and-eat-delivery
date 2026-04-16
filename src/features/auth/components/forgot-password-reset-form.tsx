import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Input } from '@/components/ui';

import { AuthFormHeader } from './auth-form-header';
import { AuthFormLayout } from './auth-form-layout';

export type ForgotPasswordResetFormProps = {
  password: string;
  confirmPassword: string;
  onChangePassword: (value: string) => void;
  onChangeConfirmPassword: (value: string) => void;
  onSubmit: () => Promise<void> | void;
  isSubmitting: boolean;
  passwordError?: string;
  confirmPasswordError?: string;
};

const MIN_PASSWORD_LENGTH = 6;

function isPasswordValid(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= MIN_PASSWORD_LENGTH;
}

export function ForgotPasswordResetForm({
  password,
  confirmPassword,
  onChangePassword,
  onChangeConfirmPassword,
  onSubmit,
  isSubmitting,
  passwordError,
  confirmPasswordError,
}: ForgotPasswordResetFormProps) {
  const { t } = useTranslation();

  const isFormValid = React.useMemo(() => {
    const passwordOk = isPasswordValid(password);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
    return passwordOk && passwordsMatch;
  }, [password, confirmPassword]);
  console.log('isFormValid', isFormValid);

  return (
    <AuthFormLayout>
      <AuthFormHeader
        title={t('auth.forgot.reset_title')}
        subtitle={t('auth.forgot.reset_subtitle')}
      />
      <Input
        testID="forgot-password-input"
        label={t('auth.forgot.reset_password_label')}
        placeholder={t('auth.forgot.reset_password_placeholder')}
        value={password}
        onChangeText={onChangePassword}
        isPassword
        error={passwordError}
      />
      <Input
        testID="forgot-confirm-password-input"
        label={t('auth.forgot.reset_confirm_password_label')}
        placeholder={t('auth.forgot.reset_confirm_password_placeholder')}
        value={confirmPassword}
        onChangeText={onChangeConfirmPassword}
        isPassword
        error={confirmPasswordError}
      />
      <Button
        label={t('auth.forgot.reset_submit')}
        variant="destructive"
        onPress={onSubmit}
        loading={isSubmitting}
        disabled={!isFormValid}
      />
    </AuthFormLayout>
  );
}
