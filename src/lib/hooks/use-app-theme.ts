import { Appearance } from 'react-native';
import { useUniwind } from 'uniwind';

/**
 * Centralized theme hook for components that use inline styles / StyleSheet.
 *
 * Correctly resolves the 'system' theme option via Appearance API so that
 * `isDark` is always accurate — unlike a bare `theme === 'dark'` check which
 * returns false when the user has selected "System" theme.
 *
 * For components that use Tailwind `className`, continue using `dark:` prefix
 * directly — no need for this hook there.
 */
export function useAppTheme() {
  const { theme } = useUniwind();

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && Appearance.getColorScheme() === 'dark');

  return {
    isDark,
    /** Semantic color tokens mapped to the design system palette */
    c: {
      /** Page / screen background */
      bg: isDark ? '#0a0a0a' : '#ffffff',
      /** Card / section background */
      card: isDark ? '#171717' : '#F5F5F5',
      /** Primary text */
      textPrimary: isDark ? '#FAFAFA' : '#1E1E1E',
      /** Secondary / muted text */
      textSecondary: isDark ? '#969696' : '#7D7D7D',
      /** Subtle border / divider */
      border: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
      /** BlurView tint */
      blurTint: (isDark ? 'dark' : 'light') as 'dark' | 'light',
    },
  };
}
