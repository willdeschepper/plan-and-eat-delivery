import { useRouter } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { CheckCircle } from '@/components/icons';
import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { Background } from '@/components/ui/background';

const AUTO_REDIRECT_DELAY_MS = 5000;

export function PasswordChangedSuccessScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/');
    }, AUTO_REDIRECT_DELAY_MS);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View className="flex-1 bg-white dark:bg-neutral-900">
      <FocusAwareStatusBar contentStyle="dark" />
      <Background fillScreen />

      <View className="flex-1 items-center justify-center px-6">
        <CheckCircle
          size={220}
          color="#22C55E"
          style={{ marginBottom: 24 }}
        />
        <Text className="mb-3 text-center font-montserrat-alternates text-3xl font-bold text-black dark:text-white">
          {t('auth.forgot.success_title')}
        </Text>
        <Text className="mb-10 max-w-xs text-center font-montserrat-alternates text-base text-neutral-500 dark:text-neutral-400">
          {t('auth.forgot.success_subtitle')}
        </Text>
      </View>
    </View>
  );
}
