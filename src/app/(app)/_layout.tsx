import { Redirect } from 'expo-router';
import { Stack } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';

import { AppDrawer } from '@/features/drawer/app-drawer';
import { DrawerProvider } from '@/features/drawer/drawer-context';
import { useAuthStore as useAuth } from '@/lib/hooks';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';

export default function AppLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();

  if (status === 'idle') {
    return <View className="flex-1 bg-white dark:bg-neutral-900" />;
  }

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }

  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }

  return (
    <DrawerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="orders" />
        <Stack.Screen name="settings" />
        <Stack.Screen
          name="stop/[id]"
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack>
      <AppDrawer />
    </DrawerProvider>
  );
}
