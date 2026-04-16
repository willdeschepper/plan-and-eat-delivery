import type { InputFieldForm } from '@/components/ui/input-field';
import { useForm } from '@tanstack/react-form';

import { useRouter } from 'expo-router';
import * as React from 'react';

import { useTranslation } from 'react-i18next';
import { Button, InputField } from '@/components/ui';
import { useSignUpFormValidators } from '@/lib/hooks';
import { AuthFooterLink } from './auth-footer-link';
import { AuthFormHeader } from './auth-form-header';
import { AuthFormLayout } from './auth-form-layout';
import { SocialLoginButtons } from './social-login-buttons';

export type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpFormProps = {
  onSubmit?: (data: SignUpFormValues) => void;
};

export function SignUpForm({ onSubmit = () => {} }: SignUpFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false);
  const {
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
  } = useSignUpFormValidators();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <AuthFormLayout contentClassName="flex-1 justify-center p-4">
      <AuthFormHeader
        title={t('auth.sign_up.title')}
        subtitle={t('auth.sign_up.subtitle')}
        testID="sign-up-form-title"
      />

      <InputField
        form={form as InputFieldForm}
        name="name"
        validators={{ onChange: validateName }}
        testID="sign-up-name-input"
        label={t('auth.sign_up.name_label')}
        placeholder={t('auth.sign_up.name_placeholder')}
        isPassword={false}
      />

      <InputField
        form={form as InputFieldForm}
        name="email"
        validators={{ onChange: validateEmail }}
        testID="sign-up-email-input"
        label={t('auth.sign_up.email_label')}
        placeholder={t('auth.sign_up.email_placeholder')}
        type="email"
        isPassword={false}
      />

      <InputField
        form={form as InputFieldForm}
        name="password"
        validators={{ onChange: validatePassword }}
        testID="sign-up-password-input"
        label={t('auth.sign_up.password_label')}
        placeholder={t('auth.sign_up.password_placeholder')}
        isPassword
        passwordVisible={passwordVisible}
        setPasswordVisible={setPasswordVisible}
      />

      <InputField
        form={form as InputFieldForm}
        name="confirmPassword"
        validators={{
          onChange: ({ value }) =>
            validateConfirmPassword({ value }, form.state.values.password ?? ''),
        }}
        testID="sign-up-confirm-password-input"
        label={t('auth.sign_up.confirm_password_label')}
        placeholder={t('auth.sign_up.confirm_password_placeholder')}
        isPassword
        passwordVisible={confirmPasswordVisible}
        setPasswordVisible={setConfirmPasswordVisible}
      />

      <form.Subscribe
        selector={state => [state.isSubmitting]}
        children={([isSubmitting]) => (
          <Button
            testID="sign-up-button"
            label={t('auth.sign_up.submit')}
            variant="destructive"
            disabled={false}
            onPress={form.handleSubmit}
            loading={isSubmitting}
          />
        )}
      />

      <SocialLoginButtons />

      <AuthFooterLink
        text={t('auth.sign_up.have_account')}
        linkText={t('auth.sign_up.log_in')}
        onPress={() => router.back()}
        testID="login-link"
      />
    </AuthFormLayout>
  );
}
