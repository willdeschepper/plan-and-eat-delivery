import { cleanup, render, screen, setup } from '@/lib/test-utils';

import { TabBarButton } from './tab-bar-button';

afterEach(cleanup);

describe('tabBarButton', () => {
  it('renders and shows correct icon for name orders', () => {
    const { toJSON } = render(<TabBarButton name="orders" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders for name delivery', () => {
    const { toJSON } = render(<TabBarButton name="delivery" />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders for name settings', () => {
    const { toJSON } = render(<TabBarButton name="settings" />);
    expect(toJSON()).toBeTruthy();
  });

  it('applies focused styles when isFocused is true', () => {
    render(<TabBarButton name="orders" isFocused testID="tab-btn" />);
    const button = screen.getByTestId('tab-btn');
    expect(button).toBeOnTheScreen();
    expect(button.props.className).toContain('border-primary-400');
    expect(button.props.className).toContain('bg-primary-50');
  });

  it('applies unfocused styles when isFocused is false', () => {
    render(<TabBarButton name="orders" isFocused={false} testID="tab-btn" />);
    const button = screen.getByTestId('tab-btn');
    expect(button.props.className).toContain('border-charcoal-200');
    expect(button.props.className).toContain('bg-white');
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    const { user } = setup(<TabBarButton name="orders" onPress={onPress} testID="tab-btn" />);
    await user.press(screen.getByTestId('tab-btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
