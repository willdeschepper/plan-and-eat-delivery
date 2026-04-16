/* eslint-disable react/no-create-ref */
import type { ProgressBarRef } from './progress-bar';
import * as React from 'react';

import { createRef } from 'react';

import { cleanup, render, screen } from '@/lib/test-utils';
import { ProgressBar } from './progress-bar';

afterEach(cleanup);

describe('progressBar', () => {
  it('renders with testID', () => {
    render(<ProgressBar totalSteps={3} currentStep={1} testID="progress-bar" />);
    expect(screen.getByTestId('progress-bar')).toBeOnTheScreen();
  });

  it('exposes goToStep via ref', () => {
    const ref = createRef<ProgressBarRef | null>();
    render(<ProgressBar ref={ref} totalSteps={3} currentStep={1} testID="progress-bar" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current).toHaveProperty('goToStep');
    expect(typeof ref.current?.goToStep).toBe('function');
  });

  it('accepts currentStep prop', () => {
    const ref = createRef<ProgressBarRef | null>();
    render(
      <ProgressBar ref={ref} totalSteps={3} currentStep={2} testID="progress-initial" />,
    );
    expect(ref.current).not.toBeNull();
  });
});
