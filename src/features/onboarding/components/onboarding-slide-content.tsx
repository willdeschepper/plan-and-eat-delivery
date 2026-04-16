import type { OnboardingSlideConfig } from '../config';

import * as React from 'react';
import { Image, View } from '@/components/ui';
import { ONBOARDING_IMAGES } from '../config';
import { OnboardingCard } from './onboarding-card';

type OnboardingSlideContentProps = {
  slide: OnboardingSlideConfig;
  onNext: () => void;
};

export function OnboardingSlideContent({
  slide,
  onNext,
}: OnboardingSlideContentProps) {
  return (
    <View className="flex-1">
      <View className="mb-8 flex-1 items-center">
        <Image
          source={ONBOARDING_IMAGES[slide.illustrationVariant]}
          style={{ width: 370, height: 370 }}
          contentFit="contain"
        />
      </View>

      <OnboardingCard
        titleTx={slide.titleTx}
        descriptionTx={slide.descriptionTx}
        primaryActionLabelTx={slide.primaryActionLabelTx}
        onPrimaryAction={onNext}
      />
    </View>
  );
}
