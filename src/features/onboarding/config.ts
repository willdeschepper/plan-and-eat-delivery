import type { TxKeyPath } from '@/lib/i18n';

export type OnboardingIllustrationVariant = 'screen1' | 'screen2' | 'screen3';

export type OnboardingSlideConfig = {
  id: 'screen1' | 'screen2' | 'screen3';
  titleTx: TxKeyPath;
  descriptionTx: TxKeyPath;
  primaryActionLabelTx: TxKeyPath;
  showSkip: boolean;
  illustrationVariant: OnboardingIllustrationVariant;
};

export const ONBOARDING_IMAGES: Record<OnboardingIllustrationVariant, number>
  = {
    screen1: require('../../../assets/slide1.png'),
    screen2: require('../../../assets/slide2.png'),
    screen3: require('../../../assets/slide3.png'),
  };

export const ONBOARDING_SLIDES: OnboardingSlideConfig[] = [
  {
    id: 'screen1',
    titleTx: 'onboarding.screen1.title',
    descriptionTx: 'onboarding.screen1.description',
    primaryActionLabelTx: 'onboarding.next',
    showSkip: true,
    illustrationVariant: 'screen1',
  },
  {
    id: 'screen2',
    titleTx: 'onboarding.screen2.title',
    descriptionTx: 'onboarding.screen2.description',
    primaryActionLabelTx: 'onboarding.next',
    showSkip: true,
    illustrationVariant: 'screen2',
  },
  {
    id: 'screen3',
    titleTx: 'onboarding.screen3.title',
    descriptionTx: 'onboarding.screen3.description',
    primaryActionLabelTx: 'onboarding.done',
    showSkip: false,
    illustrationVariant: 'screen3',
  },
];
