import type { LoginFormProps } from './components/login-form';
import { useRouter } from 'expo-router';

import * as React from 'react';

import { FocusAwareStatusBar, View } from '@/components/ui';
import { Background } from '@/components/ui/background';
import { signIn } from '@/lib/hooks';
import { LoginForm } from './components/login-form';

// TODO: replace with real API when backend is ready
const MOCK_TOKEN = {
  access: 'mock-access-token',
  refresh: 'mock-refresh-token',
};

export function LoginScreen() {
  const router = useRouter();

  const onSubmit: LoginFormProps['onSubmit'] = async (_data) => {
    // TODO: uncomment when backend is ready
    // const response = await customerLogin({ email: _data.number, password: _data.password });
    // if (!response?.token?.access || !response?.token?.refresh) { ... }
    await signIn(MOCK_TOKEN);
    router.replace('/(app)');
  };

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <Background fillScreen />
      <LoginForm onSubmit={onSubmit} />
    </View>
  );
}
