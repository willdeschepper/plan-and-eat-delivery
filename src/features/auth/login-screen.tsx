import type { LoginFormProps } from './components/login-form';
import { useRouter } from 'expo-router';

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { FocusAwareStatusBar, View } from '@/components/ui';
import { Background } from '@/components/ui/background';
import { useCourierLogin } from '@/features/courier/api';
import {
  PushNativeModuleMissingError,
  PushPermissionDeniedError,
  PushTokenUnavailableError,
  requestCourierPushToken,
} from '@/features/courier/lib/request-push-token';
import { showParsedApiError } from '@/lib/api/errors';
import { signIn } from '@/lib/hooks';
import { LoginForm } from './components/login-form';

export function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const courierLogin = useCourierLogin();

  const onSubmit: LoginFormProps['onSubmit'] = async (_data) => {
    try {
      const deviceToken = await requestCourierPushToken();
      const response = await courierLogin.mutateAsync({
        email: _data.number,
        password: _data.password,
        device_token: deviceToken,
      });

      if (!response?.token?.access || !response?.token?.refresh) {
        showParsedApiError(new Error('Invalid login response'));
        return;
      }

      await signIn(response.token);
      router.replace('/(app)');
    }
    catch (error) {
      if (error instanceof PushPermissionDeniedError) {
        showParsedApiError(new Error(t('auth.login.push_permission_denied')));
        return;
      }

      if (error instanceof PushTokenUnavailableError) {
        showParsedApiError(new Error(t('auth.login.push_token_unavailable')));
        return;
      }

      if (error instanceof PushNativeModuleMissingError) {
        showParsedApiError(new Error(t('auth.login.push_native_module_missing')));
        return;
      }

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
