import { cleanup, screen, setup } from '@/lib/test-utils';

import { SettingsScreen } from './settings-screen';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('env', () => ({
  __esModule: true,
  default: {
    EXPO_PUBLIC_NAME: 'Plan&Eat Courier',
    EXPO_PUBLIC_VERSION: '1.0.0',
  },
}));

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: mockPush,
  }),
}));

jest.mock('@/lib/i18n', () => ({
  ...jest.requireActual('@/lib/i18n'),
  useSelectedLanguage: () => ({ language: 'en', setLanguage: jest.fn() }),
}));

jest.mock('@/lib/hooks/use-selected-theme', () => ({
  useSelectedTheme: () => ({
    selectedTheme: 'system',
    setSelectedTheme: jest.fn(),
  }),
}));

jest.mock('./hooks/use-logout-confirm-modal', () => ({
  useLogoutConfirmModal: () => ({ openLogoutConfirm: jest.fn() }),
}));

afterEach(cleanup);

describe('SettingsScreen', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders hub sections and logout', () => {
    setup(<SettingsScreen />);

    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByTestId('settings-language')).toBeTruthy();
    expect(screen.getByTestId('settings-theme')).toBeTruthy();
    expect(screen.getByTestId('settings-app-name')).toBeTruthy();
    expect(screen.getByTestId('settings-version')).toBeTruthy();
    expect(screen.getByTestId('settings-rate-app')).toBeTruthy();
    expect(screen.getByTestId('settings-support')).toBeTruthy();
    expect(screen.getByTestId('settings-privacy')).toBeTruthy();
    expect(screen.getByTestId('settings-terms')).toBeTruthy();
    expect(screen.getByTestId('settings-logout')).toBeTruthy();
  });

  it('navigates to language screen', async () => {
    const { user } = setup(<SettingsScreen />);
    await user.press(screen.getByTestId('settings-language'));
    expect(mockPush).toHaveBeenCalledWith('/settings/language');
  });
});
