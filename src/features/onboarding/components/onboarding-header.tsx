import * as React from 'react';

import {
  Pressable,
  Text,
  View,
} from '@/components/ui';
import { translate } from '@/lib/i18n';

type OnboardingHeaderProps = {
  currentStep: number;
  totalSteps: number;
  onSkip?: () => void;
};

export function OnboardingHeader({
  currentStep,
  totalSteps,
  onSkip,
}: OnboardingHeaderProps) {
  const progressLabel = translate('onboarding.progress', {
    current: currentStep,
    total: totalSteps,
  });

  return (
    <View className="flex flex-row items-center justify-between">
      <Text className="font-montserrat-alternates text-[14px] text-charcoal-600 underline">
        {progressLabel}
      </Text>

      {onSkip
        ? (
            <Pressable onPress={onSkip} hitSlop={8}>
              <Text
                className="font-montserrat-alternates text-[14px] text-charcoal-600 underline"
              >
                {translate('onboarding.skip')}
              </Text>
            </Pressable>
          )
        : null}
    </View>
  );
}
