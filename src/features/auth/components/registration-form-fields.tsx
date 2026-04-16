import type { SignUpFormValidators } from '@/lib/hooks/use-sign-up-form-validators';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { AuthFormHeader } from './auth-form-header';
import { RegistrationFormActions } from './registration-form-actions';
import { RegistrationFormPersonalFields } from './registration-form-personal-fields';

export type RegistrationFormFieldsValues = {
  hasWorkplace: boolean | null;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  companyName: string;
  department: string;
};

export type RegistrationFormFieldsProps = {
  form: {
    Field: React.ComponentType<any>;
    Subscribe: React.ComponentType<any>;
    handleSubmit: () => void;
    state: { values: RegistrationFormFieldsValues };
  };
  hasWorkplace: boolean;
  validators: SignUpFormValidators;
  isFormValid: boolean;
  onBack: () => void;
};

export function RegistrationFormFields({
  form,
  validators,
  isFormValid,
  onBack,
}: RegistrationFormFieldsProps) {
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false);

  return (
    <View className="pt-4">
      <AuthFormHeader
        title={t('auth.registration.form_title')}
        subtitle={t('auth.sign_up.subtitle')}
      />

      <RegistrationFormPersonalFields
        form={form}
        validators={validators}
        passwordVisible={passwordVisible}
        confirmPasswordVisible={confirmPasswordVisible}
        setPasswordVisible={setPasswordVisible}
        setConfirmPasswordVisible={setConfirmPasswordVisible}
      />

      <RegistrationFormActions form={form} isFormValid={isFormValid} onBack={onBack} />
    </View>
  );
}
