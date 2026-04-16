import { cleanup, screen, setup } from '@/lib/test-utils';

import { AuthFooterLink } from './auth-footer-link';

afterEach(cleanup);

describe('authFooterLink', () => {
  it('calls onPress when link pressed', async () => {
    const onPress = jest.fn();
    const { user } = setup(
      <AuthFooterLink
        text="Hello"
        linkText="Tap me"
        onPress={onPress}
        testID="footer-link"
      />,
    );
    expect(screen.getByText('Hello')).toBeOnTheScreen();
    await user.press(screen.getByTestId('footer-link'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
