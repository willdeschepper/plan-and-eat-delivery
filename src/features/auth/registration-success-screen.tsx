import { useRouter } from 'expo-router';

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { CheckCircle } from '@/components/icons';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { Background } from '@/components/ui/background';
import { signIn } from '@/lib/hooks';

const AUTO_REDIRECT_DELAY_MS = 3000;

export function RegistrationSuccessScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    void (async () => {
      await signIn({ access: 'access-token', refresh: 'refresh-token' });
      timer = setTimeout(() => {
        router.replace('/(app)');
      }, AUTO_REDIRECT_DELAY_MS);
    })();
    return () => {
      if (timer)
        clearTimeout(timer);
    };
  }, [router]);

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar contentStyle="dark" />
      <Background fillScreen />

      <View className="flex-1 items-center justify-center px-6">
        <CheckCircle size={220} style={{ marginBottom: 24 }} />
        <Text className="mb-3 text-center font-montserrat-alternates text-3xl font-bold text-black dark:text-white">
          {t('auth.registration.success_title')}
        </Text>
        <Text className="mb-10 max-w-xs text-center font-montserrat-alternates text-base text-neutral-500 dark:text-neutral-400">
          {t('auth.registration.success_subtitle')}
        </Text>
      </View>
    </View>
  );
}
