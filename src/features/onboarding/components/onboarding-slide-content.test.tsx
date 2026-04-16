import { cleanup, screen, setup } from '@/lib/test-utils';

import { ONBOARDING_SLIDES } from '../config';
import { OnboardingSlideContent } from './onboarding-slide-content';

afterEach(cleanup);

describe('onboardingSlideContent', () => {
  it('invokes onNext when primary button pressed', async () => {
    const onNext = jest.fn();
    const { user } = setup(
      <OnboardingSlideContent slide={ONBOARDING_SLIDES[0]!} onNext={onNext} />,
    );
    await user.press(screen.getByText('Next'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
