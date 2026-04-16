import { cleanup, screen, setup } from '@/lib/test-utils';

import { ONBOARDING_SLIDES } from '../config';
import { OnboardingCard } from './onboarding-card';

afterEach(cleanup);

describe('onboardingCard', () => {
  it('renders translated title and calls onPrimaryAction', async () => {
    const slide = ONBOARDING_SLIDES[0]!;
    const onPrimaryAction = jest.fn();
    const { user } = setup(
      <OnboardingCard
        titleTx={slide.titleTx}
        descriptionTx={slide.descriptionTx}
        primaryActionLabelTx={slide.primaryActionLabelTx}
        onPrimaryAction={onPrimaryAction}
      />,
    );
    expect(screen.getByText('Choose your meals')).toBeOnTheScreen();
    await user.press(screen.getByText('Next'));
    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
  });
});
