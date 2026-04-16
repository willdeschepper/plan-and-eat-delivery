import type { InputFieldValidators } from '@/components/ui/input-field';

import type { SignUpFormValidators } from '@/lib/hooks/use-sign-up-form-validators';
import * as React from 'react';

export type RegistrationPersonalFieldName
  = | 'name'
    | 'surname'
    | 'email'
    | 'password'
    | 'confirmPassword'
    | 'phone';

export type PasswordVisibilityState = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export type RegistrationPersonalFieldConfig = {
  name: RegistrationPersonalFieldName;
  labelKey: string;
  placeholderKey: string;
  testID: string;
  type?: 'text' | 'numeric' | 'phone' | 'email' | 'decimal' | 'url';
  isPassword?: boolean;
  visibilityKey?: 'password' | 'confirmPassword';
  getValidator: (
    validators: SignUpFormValidators,
    form?: { state: { values: { password?: string } } },
  ) => InputFieldValidators | undefined;
};

export type UseRegistrationPersonalFieldsConfigParams = {
  form: { state: { values: { password?: string } } };
  validators: SignUpFormValidators;
  passwordVisibility: PasswordVisibilityState;
  confirmPasswordVisibility: PasswordVisibilityState;
};

export function useRegistrationPersonalFieldsConfig({
  form: _form,
  validators: _validators,
}: Omit<
  UseRegistrationPersonalFieldsConfigParams,
  'passwordVisibility' | 'confirmPasswordVisibility'
>): RegistrationPersonalFieldConfig[] {
  return React.useMemo(() => [
    {
      name: 'name',
      labelKey: 'auth.sign_up.name_label',
      placeholderKey: 'auth.sign_up.name_placeholder',
      testID: 'registration-name-input',
      isPassword: false,
      getValidator: v => ({ onChange: v.validateName }),
    },
    {
      name: 'surname',
      labelKey: 'auth.sign_up.surname_label',
      placeholderKey: 'auth.sign_up.surname_placeholder',
      testID: 'registration-surname-input',
      isPassword: false,
      getValidator: v => ({ onChange: v.validateName }),
    },
    {
      name: 'email',
      labelKey: 'auth.sign_up.email_label',
      placeholderKey: 'auth.sign_up.email_placeholder',
      testID: 'registration-email-input',
      type: 'email',
      isPassword: false,
      getValidator: v => ({ onChange: v.validateEmail }),
    },
    {
      name: 'password',
      labelKey: 'auth.sign_up.password_label',
      placeholderKey: 'auth.sign_up.password_placeholder',
      testID: 'registration-password-input',
      isPassword: true,
      visibilityKey: 'password',
      getValidator: v => ({ onChange: v.validatePassword }),
    },
    {
      name: 'confirmPassword',
      labelKey: 'auth.sign_up.confirm_password_label',
      placeholderKey: 'auth.sign_up.confirm_password_placeholder',
      testID: 'registration-confirm-password-input',
      isPassword: true,
      visibilityKey: 'confirmPassword',
      getValidator: (v, f) => ({
        onChange: ({ value }) =>
          v.validateConfirmPassword({ value }, f?.state?.values?.password ?? ''),
      }),
    },
    {
      name: 'phone',
      labelKey: 'auth.registration.phone_label',
      placeholderKey: 'auth.registration.phone_placeholder',
      testID: 'registration-phone-input',
      type: 'phone',
      isPassword: false,
      getValidator: v => ({ onChange: v.validatePhone }),
    },
  ], []);
}
