/* eslint-disable better-tailwindcss/no-unknown-classes */
import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Platform } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { useUniwind } from 'uniwind';

type Props = {
  hidden?: boolean;
  /** Override status bar content style: 'dark' = dark-content (for light backgrounds), 'light' = light-content (for dark backgrounds) */
  contentStyle?: 'dark' | 'light';
};
export function FocusAwareStatusBar({ hidden = false, contentStyle }: Props) {
  const isFocused = useIsFocused();
  const { theme } = useUniwind();
  const style = contentStyle ?? (theme === 'light' ? 'dark' : 'light');

  if (Platform.OS === 'web')
    return null;

  return isFocused
    ? (
        <SystemBars
          style={style}
          hidden={hidden}
        />
      )
    : null;
}
