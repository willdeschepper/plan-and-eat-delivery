import { Redirect, usePathname } from 'expo-router';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarButton } from '@/components/tab-bar-button';
import { useAuthStore as useAuth } from '@/lib/hooks';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';

const ROUTES_WITHOUT_TABBAR = ['/route-map', '/profile'];

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const showTabBar = !ROUTES_WITHOUT_TABBAR.includes(pathname);

  if (status === 'idle') {
    return <View className="flex-1 bg-white" />;
  }

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1 bg-white">

      <Tabs>
        <TabSlot style={{ flex: 1 }} />

        <TabList style={{ display: 'none' }}>
          <TabTrigger name="orders" href="/orders" />
          <TabTrigger name="delivery" href="/delivery" />
          <TabTrigger name="settings" href="/settings" />
        </TabList>

        {showTabBar && (
          <View
            className="flex-row items-center justify-center gap-2 bg-transparent"
            style={{ paddingBottom: Math.max(insets.bottom, 24), backgroundColor: 'transparent', position: 'absolute', bottom: 0, left: 0, right: 0 }}
          >
            <TabTrigger name="orders" asChild>
              <TabBarButton name="orders" />
            </TabTrigger>
            <TabTrigger name="delivery" asChild>
              <TabBarButton name="delivery" />
            </TabTrigger>
            <TabTrigger name="settings" asChild>
              <TabBarButton name="settings" />
            </TabTrigger>
          </View>
        )}
      </Tabs>
    </View>
  );
}
