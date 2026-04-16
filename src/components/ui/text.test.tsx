import * as React from 'react';
import { I18nManager } from 'react-native';

import { cleanup, render, screen } from '@/lib/test-utils';

import { Text } from './text';

jest.mock('@/lib/i18n', () => ({
  translate: (key: string) => `translated:${key}`,
}));

afterEach(cleanup);

describe('text', () => {
  it('renders children when tx is not provided', () => {
    render(<Text>Hello world</Text>);
    expect(screen.getByText('Hello world')).toBeOnTheScreen();
  });

  it('renders translated text when tx is provided', () => {
    render(<Text tx="auth.login.title" />);
    expect(screen.getByText('translated:auth.login.title')).toBeOnTheScreen();
  });

  it('applies writingDirection rtl when I18nManager.isRTL is true', () => {
    I18nManager.isRTL = true;
    render(<Text testID="text-rtl">RTL</Text>);
    expect(screen.getByTestId('text-rtl')).toHaveStyle({
      writingDirection: 'rtl',
    });
    I18nManager.isRTL = false;
  });

  it('applies writingDirection ltr when I18nManager.isRTL is false', () => {
    I18nManager.isRTL = false;
    render(<Text testID="text-ltr">LTR</Text>);
    expect(screen.getByTestId('text-ltr')).toHaveStyle({
      writingDirection: 'ltr',
    });
  });
});
