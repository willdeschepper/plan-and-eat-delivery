import { cleanup, screen, setup } from '@/lib/test-utils';

import { OnboardingScreen } from './onboarding-screen';

jest.mock('env', () => ({
  __esModule: true,
  default: { EXPO_PUBLIC_API_URL: 'http://api.test' },
}));

let mockRouterReplace: jest.Mock;
let mockSetIsFirstTime: jest.Mock;

jest.mock('expo-router', () => {
  mockRouterReplace = jest.fn();
  return {
    useRouter: () => ({
      replace: mockRouterReplace,
    }),
  };
});

jest.mock('@/lib/hooks/use-is-first-time', () => {
  mockSetIsFirstTime = jest.fn();
  return {
    useIsFirstTime: () => [true, mockSetIsFirstTime] as const,
  };
});

jest.mock('react-native-reanimated-carousel', () => {
  const ReactNs = require('react');
  const { View } = require('react-native');
  const MockCarousel = ({ ref, ...props }) => {
    const { data, renderItem, onSnapToItem } = props;
    const [index, setIndex] = ReactNs.useState(0);
    ReactNs.useImperativeHandle(ref, () => ({
      scrollTo: ({ count }: { count: number }) => {
        setIndex((prev: number) => {
          const next = Math.min(prev + count, data.length - 1);
          onSnapToItem(next);
          return next;
        });
      },
    }));
    return (
      <View testID="mock-carousel">
        {renderItem({ item: data[index] })}
      </View>
    );
  };
  return { __esModule: true, default: MockCarousel };
});

beforeEach(() => {
  mockRouterReplace.mockClear();
  mockSetIsFirstTime.mockClear();
});
afterEach(cleanup);

describe('onboardingScreen', () => {
  it('skip completes onboarding and navigates to login', async () => {
    const { user } = setup(<OnboardingScreen />);
    expect(screen.getByText('1/3')).toBeOnTheScreen();
    expect(screen.getByText('Skip')).toBeOnTheScreen();
    await user.press(screen.getByText('Skip'));
    expect(mockSetIsFirstTime).toHaveBeenCalledWith(false);
    expect(mockRouterReplace).toHaveBeenCalledWith('/login');
  });

  it('advances slides with Next and hides Skip on last slide', async () => {
    const { user } = setup(<OnboardingScreen />);
    await user.press(screen.getByText('Next'));
    expect(screen.getByText('2/3')).toBeOnTheScreen();
    expect(screen.getByText('We cook & deliver')).toBeOnTheScreen();
    expect(screen.getByText('Skip')).toBeOnTheScreen();

    await user.press(screen.getByText('Next'));
    expect(screen.getByText('3/3')).toBeOnTheScreen();
    expect(screen.getByText('Enjoy delicious lunches')).toBeOnTheScreen();
    expect(screen.queryByText('Skip')).toBeNull();
  });

  it('done on last slide completes without further carousel scroll', async () => {
    const { user } = setup(<OnboardingScreen />);
    await user.press(screen.getByText('Next'));
    await user.press(screen.getByText('Next'));
    await user.press(screen.getByText('Done'));
    expect(mockSetIsFirstTime).toHaveBeenCalledWith(false);
    expect(mockRouterReplace).toHaveBeenCalledWith('/login');
  });
});
