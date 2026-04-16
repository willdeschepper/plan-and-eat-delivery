import { cleanup, render, screen, setup } from '@/lib/test-utils';

import { OnboardingHeader } from './onboarding-header';

afterEach(cleanup);

describe('onboardingHeader', () => {
  it('shows progress label from i18n', () => {
    render(<OnboardingHeader currentStep={2} totalSteps={3} />);
    expect(screen.getByText('2/3')).toBeOnTheScreen();
  });

  it('renders skip and calls onSkip when pressed', async () => {
    const onSkip = jest.fn();
    const { user } = setup(
      <OnboardingHeader currentStep={1} totalSteps={3} onSkip={onSkip} />,
    );
    expect(screen.getByText('Skip')).toBeOnTheScreen();
    await user.press(screen.getByText('Skip'));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('hides skip when onSkip is undefined', () => {
    setup(<OnboardingHeader currentStep={1} totalSteps={3} />);
    expect(screen.queryByText('Skip')).toBeNull();
  });
});
