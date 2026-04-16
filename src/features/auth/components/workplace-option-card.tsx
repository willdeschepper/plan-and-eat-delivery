import * as React from 'react';
import { Pressable, View } from 'react-native';

import { Image, Text } from '@/components/ui';

const WORKPLACE_IMAGES = {
  corp: require('../../../../assets/corp-work.png'),
  own: require('../../../../assets/own-work.png'),
} as const;

export type WorkplaceOptionCardProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  imageType: keyof typeof WORKPLACE_IMAGES;
  testID?: string;
};

export function WorkplaceOptionCard({
  label,
  selected,
  onPress,
  imageType,
  testID,
}: WorkplaceOptionCardProps) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      className="mb-4 overflow-hidden rounded-2xl border bg-white shadow-md"
      style={{
        borderColor: selected ? 'rgba(241, 131, 137, 1)' : 'rgba(231, 231, 231, 1)',
      }}
    >
      <View className="flex-row items-center px-4 py-5">
        <View className="mr-4 size-20 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
          <Image
            source={WORKPLACE_IMAGES[imageType]}
            className="size-full"
            contentFit="contain"
          />
        </View>
        <Text
          className="flex-1 font-montserrat-alternates text-base text-[#141414] dark:text-neutral-100"
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
