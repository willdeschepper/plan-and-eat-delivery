import type { InputFieldForm } from '@/components/ui/input-field';

import { useForm } from '@tanstack/react-form';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text as RNText } from 'react-native';

import { Button, InputField, View } from '@/components/ui';
import { useLoginFormValidators } from '@/lib/hooks';
import { AuthFormHeader } from './auth-form-header';
import { AuthFormLayout } from './auth-form-layout';

export type FormType = {
  number: string;
  password: string;
};

export type LoginFormProps = {
  onSubmit?: (data: FormType) => void;
};

export function LoginForm({ onSubmit = () => {} }: LoginFormProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const { validateNumber, validatePassword } = useLoginFormValidators();

  const form = useForm({
    defaultValues: {
      number: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <AuthFormLayout contentClassName="flex-1 justify-center p-4">
      <AuthFormHeader
        title={t('auth.login.title')}
        subtitle={t('auth.login.subtitle')}
        testID="form-title"
      />

      <InputField
        form={form as InputFieldForm}
        name="number"
        validators={{ onChange: validateNumber }}
        testID="number-input"
        label={t('auth.login.email_label')}
        isPassword={false}
      />

      <InputField
        form={form as InputFieldForm}
        name="password"
        validators={{ onChange: validatePassword }}
        testID="password-input"
        label={t('auth.login.password_label')}
        isPassword
        passwordVisible={passwordVisible}
        setPasswordVisible={setPasswordVisible}
      />

      <Pressable
        onPress={() => router.push('/forgot-password')}
        className="mb-4 self-end"
        testID="forgot-password-link"
      >
        <RNText className="text-base text-[#141414] underline">
          {t('auth.login.forgot_password')}
        </RNText>
      </Pressable>

      <form.Subscribe
        selector={state => [state.isSubmitting, state.values.number, state.values.password]}
        children={([isSubmitting, number, password]) => {
          const numStr = typeof number === 'string' ? number : '';
          const passStr = typeof password === 'string' ? password : '';
          const isFormValid = Boolean(numStr.trim() && passStr.trim());
          return (
            <Button
              testID="login-button"
              label={t('auth.login.submit')}
              variant="destructive"
              disabled={!isFormValid}
              onPress={form.handleSubmit}
              loading={Boolean(isSubmitting)}
            />
          );
        }}
      />
    </AuthFormLayout>
  );
}
