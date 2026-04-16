import { cleanup, render, screen } from '@/lib/test-utils';

import { OnboardingLogoSection } from './onboarding-logo-section';

jest.mock('@/components/icons/app-icon', () => {
  const RN = require('react-native');
  return {
    AppIcon: (props: Record<string, unknown>) => (
      <RN.View testID="onboarding-app-icon" {...props} />
    ),
  };
});

afterEach(cleanup);

describe('onboardingLogoSection', () => {
  it('renders without className', () => {
    render(<OnboardingLogoSection />);
    expect(screen.getByTestId('onboarding-app-icon')).toBeOnTheScreen();
  });

  it('renders with className', () => {
    render(<OnboardingLogoSection className="mt-10" />);
    expect(screen.getByTestId('onboarding-app-icon')).toBeOnTheScreen();
  });
});
