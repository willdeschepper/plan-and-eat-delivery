import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export function DeliveryScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold text-charcoal-900">
        Active deliveries
      </Text>
      <Text className="mt-2 text-center text-charcoal-500">
        This is a placeholder screen for courier delivery workflow.
      </Text>
    </View>
  );
}
