import type { Href } from 'expo-router';
import type { TxKeyPath } from '@/lib/i18n';
import * as React from 'react';

export type SettingsModalKey = 'logout';

export type SettingsItem
  = | { kind: 'navigate'; tx: TxKeyPath; route: Href; testID?: string }
    | { kind: 'modal'; tx: TxKeyPath; modal: SettingsModalKey; testID?: string };

export function useSettingsMenuItems(): {
  generalItems: SettingsItem[];
  supportItems: SettingsItem[];
  legalItems: SettingsItem[];
} {
  const generalItems = React.useMemo<SettingsItem[]>(
    () => [
      {
        kind: 'navigate',
        tx: 'settings.language',
        route: '/settings/language',
        testID: 'settings-language',
      },
      {
        kind: 'navigate',
        tx: 'settings.theme.title',
        route: '/settings/theme',
        testID: 'settings-theme',
      },
    ],
    [],
  );

  const supportItems = React.useMemo<SettingsItem[]>(
    () => [
      {
        kind: 'navigate',
        tx: 'settings.rate',
        route: '/settings/rate-app',
        testID: 'settings-rate-app',
      },
      {
        kind: 'navigate',
        tx: 'settings.support',
        route: '/settings/support',
        testID: 'settings-support',
      },
    ],
    [],
  );

  const legalItems = React.useMemo<SettingsItem[]>(
    () => [
      {
        kind: 'navigate',
        tx: 'settings.privacy',
        route: '/settings/privacy',
        testID: 'settings-privacy',
      },
      {
        kind: 'navigate',
        tx: 'settings.terms',
        route: '/settings/terms',
        testID: 'settings-terms',
      },
    ],
    [],
  );

  return { generalItems, supportItems, legalItems };
}
