import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

import {
  FocusAwareStatusBar,
  SafeAreaView,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks/use-is-first-time';

import { OnboardingBackground } from './components/onboarding-background';
import { OnboardingHeader } from './components/onboarding-header';
import { OnboardingLogoSection } from './components/onboarding-logo-section';
import { OnboardingSlideContent } from './components/onboarding-slide-content';
import { ONBOARDING_SLIDES } from './config';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const CAROUSEL_WIDTH = WINDOW_WIDTH - 32;

export function OnboardingScreen() {
  const { height: screenHeight } = useWindowDimensions();
  const [, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const carouselRef = React.useRef<ICarouselInstance | null>(null);
  const carouselProgress = useSharedValue(0);

  const handleFinish = React.useCallback(() => {
    setIsFirstTime(false);
    router.replace('/login');
  }, [router, setIsFirstTime]);

  const handleNext = React.useCallback(() => {
    if (step < ONBOARDING_SLIDES.length - 1) {
      carouselRef.current?.scrollTo({ count: 1, animated: true });
    }
    else {
      handleFinish();
    }
  }, [step, handleFinish]);

  const handleSnapToItem = React.useCallback((index: number) => {
    setStep(index);
  }, []);

  const showSkip = ONBOARDING_SLIDES[step]?.showSkip ?? false;

  const renderItem = React.useCallback(
    ({ item }: { item: (typeof ONBOARDING_SLIDES)[number] }) => (
      <OnboardingSlideContent slide={item} onNext={handleNext} />
    ),
    [handleNext],
  );

  const carouselHeight = React.useMemo(
    () => Math.min(Math.max(screenHeight * 0.75, 400), 680),
    [screenHeight],
  );

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />

      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 px-4 pt-4 pb-8">
          <OnboardingHeader
            currentStep={step + 1}
            totalSteps={ONBOARDING_SLIDES.length}
            onSkip={showSkip ? handleFinish : undefined}
          />

          <OnboardingLogoSection className="mt-10 mb-8" />
          <OnboardingBackground
            carouselProgress={carouselProgress}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
          <View className="flex-1">
            <Carousel
              ref={carouselRef}
              data={ONBOARDING_SLIDES}
              width={CAROUSEL_WIDTH}
              height={carouselHeight}
              loop={false}
              defaultIndex={0}
              onProgressChange={carouselProgress}
              onSnapToItem={handleSnapToItem}
              renderItem={renderItem}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
