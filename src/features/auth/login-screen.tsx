import type { LoginFormProps } from './components/login-form';
import { useRouter } from 'expo-router';

import * as React from 'react';

import { FocusAwareStatusBar, View } from '@/components/ui';
import { Background } from '@/components/ui/background';
import { useCourierLogin } from '@/features/courier/api';
import { requestCourierPushToken } from '@/features/courier/lib/request-push-token';
import { showLocalError, showParsedApiError } from '@/lib/api/errors';
import { signIn } from '@/lib/hooks';
import { LoginForm } from './components/login-form';

export function LoginScreen() {
  const router = useRouter();
  const courierLogin = useCourierLogin();

  const onSubmit: LoginFormProps['onSubmit'] = async (_data) => {
    try {
      let deviceToken: string | undefined;
      try {
        deviceToken = await requestCourierPushToken();
      }
      catch {
        // Push token is optional now — proceed without it.
        deviceToken = undefined;
      }

      const response = await courierLogin.mutateAsync({
        email: _data.number,
        password: _data.password,
        ...(deviceToken ? { device_token: deviceToken } : {}),
      });

      if (!response?.token?.access || !response?.token?.refresh) {
        showLocalError(new Error('Invalid login response'));
        return;
      }

      await signIn(response.token);
      router.replace('/(app)');
    }
    catch (error) {
      showParsedApiError(error);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <Background fillScreen />
      <LoginForm onSubmit={onSubmit} />
    </View>
  );
}
