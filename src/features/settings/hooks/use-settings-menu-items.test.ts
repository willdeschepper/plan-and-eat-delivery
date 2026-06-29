import { renderHook } from '@testing-library/react-native';

import { useSettingsMenuItems } from './use-settings-menu-items';

describe('useSettingsMenuItems', () => {
  it('returns courier-relevant menu groups', () => {
    const { result } = renderHook(() => useSettingsMenuItems());

    expect(result.current.generalItems).toHaveLength(2);
    const generalRoutes = result.current.generalItems
      .filter((i): i is Extract<typeof i, { kind: 'navigate' }> => i.kind === 'navigate')
      .map(i => i.route);
    expect(generalRoutes).toEqual(['/settings/language', '/settings/theme']);

    const supportRoutes = result.current.supportItems
      .filter((i): i is Extract<typeof i, { kind: 'navigate' }> => i.kind === 'navigate')
      .map(i => i.route);
    expect(supportRoutes).toEqual(['/settings/rate-app', '/settings/support']);

    const legalRoutes = result.current.legalItems
      .filter((i): i is Extract<typeof i, { kind: 'navigate' }> => i.kind === 'navigate')
      .map(i => i.route);
    expect(legalRoutes).toEqual(['/settings/privacy', '/settings/terms']);
  });
});
