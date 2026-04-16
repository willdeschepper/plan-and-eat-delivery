import * as React from 'react';

import { AppIcon } from '@/components/icons/app-icon';
import { View } from '@/components/ui';

type OnboardingLogoSectionProps = {
  className?: string;
};

export function OnboardingLogoSection({
  className,
}: OnboardingLogoSectionProps) {
  return (
    <View className={`z-10 items-center ${className ?? ''}`}>
      <AppIcon width={96} height={68} color="#E8313B" />
    </View>
  );
}
