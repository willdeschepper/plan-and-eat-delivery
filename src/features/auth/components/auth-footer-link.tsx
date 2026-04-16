import * as React from 'react';
import { Pressable, Text as RNText, View } from 'react-native';

import { Text } from '@/components/ui';

export type AuthFooterLinkProps = {
  text: string;
  linkText: string;
  onPress: () => void;
  testID?: string;
};

export function AuthFooterLink({ text, linkText, onPress, testID }: AuthFooterLinkProps) {
  return (
    <View className="mt-6 flex-row flex-wrap justify-center gap-1">
      <Text className="text-center text-neutral-600">{text}</Text>
      <Pressable onPress={onPress} testID={testID}>
        <RNText className="text-center text-base text-danger-600 underline">
          {linkText}
        </RNText>
      </Pressable>
    </View>
  );
}
