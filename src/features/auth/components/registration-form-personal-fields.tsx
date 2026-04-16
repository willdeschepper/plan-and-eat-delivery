import type { RegistrationFormFieldsValues } from './registration-form-fields';
import type { InputFieldForm } from '@/components/ui/input-field';
import type { SignUpFormValidators } from '@/lib/hooks/use-sign-up-form-validators';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { View } from 'react-native';
import { InputField } from '@/components/ui';

import { useRegistrationPersonalFieldsConfig } from './use-registration-personal-fields-config';

export type RegistrationFormPersonalFieldsProps = {
  form: InputFieldForm & { state: { values: RegistrationFormFieldsValues } };
  validators: SignUpFormValidators;
  passwordVisible: boolean;
  confirmPasswordVisible: boolean;
  setPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setConfirmPasswordVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export function RegistrationFormPersonalFields({
  form,
  validators,
  passwordVisible,
  confirmPasswordVisible,
  setPasswordVisible,
  setConfirmPasswordVisible,
}: RegistrationFormPersonalFieldsProps) {
  const { t } = useTranslation();
  const fieldsConfig = useRegistrationPersonalFieldsConfig({ form, validators });

  return (
    <View>
      {fieldsConfig.map(config => (
        <InputField
          key={config.name}
          form={form}
          name={config.name}
          validators={config.getValidator(validators, form)}
          testID={config.testID}
          label={t(config.labelKey as never)}
          placeholder={t(config.placeholderKey as never)}
          type={config.type}
          isPassword={config.isPassword}
          passwordVisible={
            config.visibilityKey === 'password'
              ? passwordVisible
              : config.visibilityKey === 'confirmPassword'
                ? confirmPasswordVisible
                : undefined
          }
          setPasswordVisible={
            config.visibilityKey === 'password'
              ? setPasswordVisible
              : config.visibilityKey === 'confirmPassword'
                ? setConfirmPasswordVisible
                : undefined
          }
        />
      ))}
    </View>
  );
}
