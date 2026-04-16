import type { LoginFormProps } from './components/login-form';
import { useRouter } from 'expo-router';

import * as React from 'react';

import { FocusAwareStatusBar, showErrorMessage, View } from '@/components/ui';
import { Background } from '@/components/ui/background';
import { showParsedApiError } from '@/lib/api/errors';
import { signIn } from '@/lib/hooks';
import { assertOnline } from '@/lib/network';
import { useCustomerLogin } from './api';
import { LoginForm } from './components/login-form';

export function LoginScreen() {
  const router = useRouter();
  const { mutateAsync: customerLogin } = useCustomerLogin();

  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    if (!assertOnline()) {
      return;
    }
    try {
      const response = await customerLogin({
        email: data.number,
        password: data.password,
      });

      if (!response?.token?.access || !response?.token?.refresh) {
        showErrorMessage('Invalid login response. Please try again.');
        return;
      }

      await signIn({
        access: response.token.access,
        refresh: response.token.refresh,
      });
      router.replace('/(app)');
    }
    catch (error) {
      showParsedApiError(error);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar contentStyle="dark" />
      <Background fillScreen />
      <LoginForm onSubmit={onSubmit} />
    </View>
  );
}
