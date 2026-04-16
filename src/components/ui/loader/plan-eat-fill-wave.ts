import {
  PLAN_EAT_WORDMARK_VIEWBOX_HEIGHT,
  PLAN_EAT_WORDMARK_VIEWBOX_WIDTH,
} from '@/components/ui/loader/plan-eat-wordmark-geometry';

/** Horizontal resolution of the wavy surface (polyline). */
export const WAVE_SEGMENTS = 36;

/** Peak deviation from the mean fill line, in viewBox units. */
export const WAVE_AMPLITUDE = 5;

/** Number of full sine cycles across the wordmark width. */
export const WAVE_CYCLES = 1.5;

/** One full phase sweep duration (linear 0..2π), ms. */
export const WAVE_PHASE_CYCLE_MS = 2800;

const TWO_PI = Math.PI * 2;

const W = PLAN_EAT_WORDMARK_VIEWBOX_WIDTH;
const H = PLAN_EAT_WORDMARK_VIEWBOX_HEIGHT;

/**
 * Closed path for liquid fill: flat bottom, wavy top, clipped by letter mask elsewhere.
 * Must run on the UI thread (worklet).
 */
export function buildLiquidPathD(progress: number, phase: number): string {
  'worklet';
  const p = Math.min(1, Math.max(0, progress));
  if (p >= 0.998) {
    return `M 0 0 L ${W} 0 L ${W} ${H} L 0 ${H} Z`;
  }
  if (p <= 0.001) {
    return `M 0 ${H} L ${W} ${H} L ${W} ${H} Z`;
  }

  const yBase = H * (1 - p);

  const yAt = (x: number): number => {
    const raw = yBase + WAVE_AMPLITUDE * Math.sin((TWO_PI * WAVE_CYCLES * x) / W + phase);
    return Math.min(raw, H);
  };

  let d = `M 0 ${H} L ${W} ${H} L ${W} ${yAt(W)} `;
  for (let i = WAVE_SEGMENTS - 1; i >= 0; i--) {
    const x = (i / WAVE_SEGMENTS) * W;
    d += `L ${x} ${yAt(x)} `;
  }
  d += `L 0 ${H} Z`;
  return d;
}
