import { cleanup, screen, setup } from '@/lib/test-utils';

import { LanguageScreen } from './language-screen';

const mockSetLanguage = jest.fn();

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock('@/lib/i18n', () => ({
  ...jest.requireActual('@/lib/i18n'),
  useSelectedLanguage: () => ({ language: 'en', setLanguage: mockSetLanguage }),
}));

afterEach(cleanup);

describe('LanguageScreen', () => {
  beforeEach(() => {
    mockSetLanguage.mockClear();
  });

  it('renders language options', () => {
    setup(<LanguageScreen />);
    expect(screen.getByTestId('settings-language-option-en')).toBeTruthy();
    expect(screen.getByTestId('settings-language-option-ru')).toBeTruthy();
    expect(screen.getByTestId('settings-language-option-az')).toBeTruthy();
  });

  it('calls setLanguage when selecting a different language', async () => {
    const { user } = setup(<LanguageScreen />);
    await user.press(screen.getByTestId('settings-language-option-ru'));
    expect(mockSetLanguage).toHaveBeenCalledWith('ru');
  });
});
