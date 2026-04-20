import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export function RouteMapScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-neutral-900">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold text-charcoal-900 dark:text-neutral-50">
        Route map
      </Text>
      <Text className="mt-2 text-center text-charcoal-500 dark:text-neutral-400">
        Placeholder for route map and navigation flow.
      </Text>
    </View>
  );
}
