/* eslint-disable testing-library/prefer-screen-queries */
import { cleanup, render, screen } from '@testing-library/react-native';

import { Platform } from 'react-native';

import { FocusAwareStatusBar } from './focus-aware-status-bar';

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(),
}));

jest.mock('uniwind', () => ({
  useUniwind: jest.fn(),
}));

jest.mock('react-native-edge-to-edge', () => ({
  SystemBars: (props: { style: string; hidden: boolean }) => {
    const React = require('react');
    const RN = require('react-native');
    return React.createElement(RN.View, {
      testID: 'system-bars',
      style: props.style,
      hidden: props.hidden,
    });
  },
}));

const useIsFocusedMock = jest.requireMock('@react-navigation/native').useIsFocused as jest.Mock;
const useUniwindMock = jest.requireMock('uniwind').useUniwind as jest.Mock;

afterEach(cleanup);

describe('focusAwareStatusBar', () => {
  beforeEach(() => {
    useIsFocusedMock.mockReturnValue(true);
    useUniwindMock.mockReturnValue({ theme: 'dark' });
  });

  it('returns null on web', () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const { queryByTestId } = render(<FocusAwareStatusBar />);
    expect(queryByTestId('system-bars')).toBeNull();
    jest.replaceProperty(Platform, 'OS', 'ios');
  });

  it('renders SystemBars when focused and not web', () => {
    useIsFocusedMock.mockReturnValue(true);
    const { getByTestId } = render(
      <FocusAwareStatusBar />,
    );
    const bars = getByTestId('system-bars');
    expect(bars).toBeOnTheScreen();
    expect(bars.props.style).toBe('light'); // dark theme → light content
  });

  it('uses contentStyle when provided', () => {
    render(<FocusAwareStatusBar contentStyle="dark" />);
    const bars = screen.getByTestId('system-bars');
    expect(bars.props.style).toBe('dark');
  });

  it('passes hidden to SystemBars', () => {
    render(<FocusAwareStatusBar hidden />);
    const bars = screen.getByTestId('system-bars');
    expect(bars.props.hidden).toBe(true);
  });

  it('returns null when not focused', () => {
    useIsFocusedMock.mockReturnValue(false);
    const { queryByTestId } = render(<FocusAwareStatusBar />);
    expect(queryByTestId('system-bars')).toBeNull();
  });
});
