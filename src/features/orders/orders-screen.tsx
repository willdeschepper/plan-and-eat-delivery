import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export function OrdersScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold text-charcoal-900">
        Courier orders
      </Text>
      <Text className="mt-2 text-center text-charcoal-500">
        This is a placeholder screen for the orders feature module.
      </Text>
    </View>
  );
}
