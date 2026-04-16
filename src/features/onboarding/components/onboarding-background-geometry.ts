/**
 * ViewBox 0 0 402 679 — keyframes for onboarding decorative SVG.
 * LayoutB coordinates approximate the second onboarding frame (tune vs Figma if needed).
 */
export const ONBOARDING_BG_LAYOUT_A = {
  primary: { cx: 350.5, cy: 139.5 },
  secondary: { cx: 30, cy: 587 },
} as const;

export const ONBOARDING_BG_LAYOUT_B = {
  primary: { cx: 58, cy: 118 },
  secondary: { cx: 348, cy: 568 },
} as const;

export type OnboardingBgNode = { cx: number; cy: number };

function lerp(a: number, b: number, t: number): number {
  'worklet';
  return a + (b - a) * t;
}

function lerpNode(
  from: OnboardingBgNode,
  to: OnboardingBgNode,
  t: number,
): OnboardingBgNode {
  'worklet';
  return {
    cx: lerp(from.cx, to.cx, t),
    cy: lerp(from.cy, to.cy, t),
  };
}

/**
 * Maps carousel `absoluteProgress` (0 … slidesCount-1) to primary/secondary centers.
 * Segment [0,1]: A → B; segment (1,2]: B → A so slide 3 matches slide 1 geometry.
 */
export function getOnboardingBackgroundLayout(progress: number): {
  primary: OnboardingBgNode;
  secondary: OnboardingBgNode;
} {
  'worklet';
  const p = Math.max(0, Math.min(progress, 2));
  let t: number;
  let fromPrimary: OnboardingBgNode;
  let toPrimary: OnboardingBgNode;
  let fromSecondary: OnboardingBgNode;
  let toSecondary: OnboardingBgNode;

  if (p <= 1) {
    t = p;
    fromPrimary = ONBOARDING_BG_LAYOUT_A.primary;
    toPrimary = ONBOARDING_BG_LAYOUT_B.primary;
    fromSecondary = ONBOARDING_BG_LAYOUT_A.secondary;
    toSecondary = ONBOARDING_BG_LAYOUT_B.secondary;
  }
  else {
    t = p - 1;
    fromPrimary = ONBOARDING_BG_LAYOUT_B.primary;
    toPrimary = ONBOARDING_BG_LAYOUT_A.primary;
    fromSecondary = ONBOARDING_BG_LAYOUT_B.secondary;
    toSecondary = ONBOARDING_BG_LAYOUT_A.secondary;
  }

  return {
    primary: lerpNode(fromPrimary, toPrimary, t),
    secondary: lerpNode(fromSecondary, toSecondary, t),
  };
}

export function buildConnectorPath(
  primary: OnboardingBgNode,
  secondary: OnboardingBgNode,
): string {
  'worklet';
  return `M${primary.cx} ${primary.cy}L${secondary.cx} ${secondary.cy}`;
}
