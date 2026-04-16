import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui';
import { AuthFooterLink } from './auth-footer-link';

export type RegistrationFormActionsProps = {
  form: { Subscribe: React.ComponentType<any>; handleSubmit: () => void };
  isFormValid: boolean;
  onBack: () => void;
};

export function RegistrationFormActions({ form, isFormValid, onBack }: RegistrationFormActionsProps) {
  const { t } = useTranslation();

  return (
    <>
      <form.Subscribe
        selector={(state: any) => [state.isSubmitting]}
        children={([isSubmitting]: any[]) => (
          <Button
            testID="registration-submit-button"
            label={t('auth.sign_up.submit')}
            variant="destructive"
            disabled={!isFormValid}
            onPress={form.handleSubmit}
            loading={isSubmitting}
          />
        )}
      />
      <AuthFooterLink
        text={t('auth.sign_up.have_account')}
        linkText={t('auth.sign_up.log_in')}
        onPress={onBack}
        testID="registration-login-link"
      />
    </>
  );
}
