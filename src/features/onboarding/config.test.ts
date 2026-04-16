import {
  ONBOARDING_IMAGES,
  ONBOARDING_SLIDES,
} from './config';

describe('onboarding config', () => {
  it('defines three slides with unique ids', () => {
    expect(ONBOARDING_SLIDES).toHaveLength(3);
    const ids = ONBOARDING_SLIDES.map(s => s.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids).toEqual(['screen1', 'screen2', 'screen3']);
  });

  it('showSkip is true on first two slides and false on last', () => {
    expect(ONBOARDING_SLIDES[0]?.showSkip).toBe(true);
    expect(ONBOARDING_SLIDES[1]?.showSkip).toBe(true);
    expect(ONBOARDING_SLIDES[2]?.showSkip).toBe(false);
  });

  it('maps every illustrationVariant to ONBOARDING_IMAGES', () => {
    for (const slide of ONBOARDING_SLIDES) {
      expect(ONBOARDING_IMAGES[slide.illustrationVariant]).toBeDefined();
    }
    expect(Object.keys(ONBOARDING_IMAGES).sort()).toEqual([
      'screen1',
      'screen2',
      'screen3',
    ]);
  });

  it('uses next label on first slides and done on last', () => {
    expect(ONBOARDING_SLIDES[0]?.primaryActionLabelTx).toBe('onboarding.next');
    expect(ONBOARDING_SLIDES[1]?.primaryActionLabelTx).toBe('onboarding.next');
    expect(ONBOARDING_SLIDES[2]?.primaryActionLabelTx).toBe('onboarding.done');
  });
});
