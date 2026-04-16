import { cleanup, screen, setup } from '@/lib/test-utils';

import { SignUpForm } from './sign-up-form';

jest.mock('env', () => ({
  __esModule: true,
  default: { EXPO_PUBLIC_API_URL: 'http://api.test' },
}));

jest.mock('expo-router', () => ({
  // eslint-disable-next-line react/no-unnecessary-use-prefix -- mock of expo-router API
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
}));

afterEach(cleanup);

describe('signUpForm', () => {
  it('renders header and field test ids', async () => {
    setup(<SignUpForm />);
    expect(await screen.findByTestId('sign-up-form-title')).toBeOnTheScreen();
    expect(screen.getByTestId('sign-up-name-input')).toBeOnTheScreen();
    expect(screen.getByTestId('sign-up-email-input')).toBeOnTheScreen();
    expect(screen.getByTestId('sign-up-button')).toBeOnTheScreen();
  });
});
