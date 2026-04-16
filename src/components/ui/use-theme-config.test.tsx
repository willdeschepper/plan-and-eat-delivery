import { cleanup, renderHook } from '@testing-library/react-native';

import { useThemeConfig } from './use-theme-config';

jest.mock('uniwind', () => ({
  useUniwind: jest.fn(),
}));

const useUniwindMock = jest.requireMock('uniwind').useUniwind as jest.Mock;

afterEach(cleanup);

describe('useThemeConfig', () => {
  it('returns dark theme when theme is dark', () => {
    useUniwindMock.mockReturnValue({ theme: 'dark' });
    const { result } = renderHook(() => useThemeConfig());
    const theme = result.current;
    expect(theme).toBeDefined();
    expect(theme.colors).toBeDefined();
    expect(theme.colors.background).toBe('#121212'); // colors.charcoal[950]
    expect(theme.colors.primary).toBeDefined();
  });

  it('returns light theme when theme is light', () => {
    useUniwindMock.mockReturnValue({ theme: 'light' });
    const { result } = renderHook(() => useThemeConfig());
    const theme = result.current;
    expect(theme).toBeDefined();
    expect(theme.colors).toBeDefined();
    expect(theme.colors.background).toBe('#ffffff'); // colors.white
    expect(theme.colors.primary).toBeDefined();
  });

  it('returns light theme when theme is not dark', () => {
    useUniwindMock.mockReturnValue({ theme: 'system' });
    const { result } = renderHook(() => useThemeConfig());
    const theme = result.current;
    expect(theme.colors.background).toBe('#ffffff');
  });
});
