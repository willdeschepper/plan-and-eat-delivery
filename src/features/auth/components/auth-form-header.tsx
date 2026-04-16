import * as React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';

export type AuthFormHeaderProps = {
  title: string;
  subtitle?: string;
  testID?: string;
};

export function AuthFormHeader({ title, subtitle, testID }: AuthFormHeaderProps) {
  return (
    <View className="mb-8">
      <Text
        testID={testID}
        className="pb-2 text-left font-montserrat-alternates text-4xl font-bold text-[#141414]"
      >
        {title}
      </Text>
      {subtitle !== undefined && subtitle !== '' && (
        <Text className="max-w-xs text-left font-montserrat-alternates text-lg text-neutral-500">
          {subtitle}
        </Text>
      )}
    </View>
  );
}
