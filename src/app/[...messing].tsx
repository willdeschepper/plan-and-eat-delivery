import { Link, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Text, View } from '@/components/ui';

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-2xl font-bold">
          {t('common.not_found_title')}
        </Text>

        <Link href="/login" className="mt-4">
          <Text className="text-blue-500 underline">{t('common.go_to_login')}</Text>
        </Link>
      </View>
    </>
  );
}
