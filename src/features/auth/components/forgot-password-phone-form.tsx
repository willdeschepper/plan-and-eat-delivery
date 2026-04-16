import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui';

import { AuthSingleFieldForm } from './auth-single-field-form';

export type ForgotPasswordPhoneFormProps = {
  number: string;
  onChangeNumber: (value: string) => void;
  onSubmit: () => Promise<void> | void;
  isSubmitting: boolean;
};

export function ForgotPasswordPhoneForm({
  number,
  onChangeNumber,
  onSubmit,
  isSubmitting,
}: ForgotPasswordPhoneFormProps) {
  const { t } = useTranslation();

  return (
    <AuthSingleFieldForm
      title={t('auth.forgot.title')}
      subtitle={t('auth.forgot.subtitle')}
      submitLabel={t('auth.forgot.submit')}
      onSubmit={onSubmit}
      loading={isSubmitting}
      submitTestID="forgot-phone-submit"
      headerTestID="forgot-phone-header"
    >
      <Input
        testID="forgot-number-input"
        label={t('auth.login.number_label')}
        placeholder={t('auth.login.number_placeholder')}
        value={number}
        onChangeText={onChangeNumber}
        type="phone"
        isPassword={false}
      />
    </AuthSingleFieldForm>
  );
}
