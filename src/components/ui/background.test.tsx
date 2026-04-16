import * as React from 'react';
import { Dimensions } from 'react-native';

import { cleanup, render, screen } from '@/lib/test-utils';

import { Background } from './background';

const SCREEN_OVERFLOW = 30;

afterEach(cleanup);

describe('background', () => {
  it('renders with passed width and height when fillScreen is false', () => {
    render(<Background testID="background" width={300} height={600} />);
    const svg = screen.getByTestId('background');
    expect(svg).toBeOnTheScreen();
    expect(svg.props.width).toBe(300);
    expect(svg.props.height).toBe(600);
  });

  it('uses window dimensions plus overflow when fillScreen is true', () => {
    const { width: w, height: h } = Dimensions.get('window');
    render(<Background testID="bg-fill" fillScreen />);
    const svg = screen.getByTestId('bg-fill');
    expect(svg).toBeOnTheScreen();
    expect(svg.props.width).toBe(w + SCREEN_OVERFLOW);
    expect(svg.props.height).toBe(h + SCREEN_OVERFLOW);
  });

  it('passes style as array when fillScreen is true', () => {
    render(<Background testID="bg-style" fillScreen />);
    const svg = screen.getByTestId('bg-style');
    expect(Array.isArray(svg.props.style)).toBe(true);
    expect(svg.props.style.length).toBeGreaterThanOrEqual(1);
  });
});
