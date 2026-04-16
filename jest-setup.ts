/* eslint-disable ts/ban-ts-comment */
/* eslint-disable no-restricted-globals */

// Mock react-native-worklets first
jest.mock('react-native-worklets', () => ({
  __esModule: true,
  default: {},
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;

  return {
    __esModule: true,
    default: {
      View,
      ScrollView: View,
      createAnimatedComponent: (component: any) => component,
    },
    useSharedValue: jest.fn((init?: number) => ({ value: init ?? 0 })),
    useDerivedValue: jest.fn((fn: () => number) => ({ value: fn() })),
    useAnimatedStyle: jest.fn(fn => fn()),
    interpolate: jest.fn((value: number, inputRange: number[], outputRange: number[]) => {
      if (value <= inputRange[0])
        return outputRange[0];
      for (let i = 0; i < inputRange.length - 1; i++) {
        const x0 = inputRange[i];
        const x1 = inputRange[i + 1];
        if (value <= x1) {
          const y0 = outputRange[i];
          const y1 = outputRange[i + 1];
          if (x1 === x0)
            return y0;
          const t = (value - x0) / (x1 - x0);
          return y0 + t * (y1 - y0);
        }
      }
      return outputRange[outputRange.length - 1];
    }),
    interpolateColor: jest.fn(
      (value: number, inputRange: number[], colorRange: string[]) => {
        const [in0, in1] = inputRange;
        if (value <= in0)
          return colorRange[0];
        if (value >= in1)
          return colorRange[colorRange.length - 1];
        return colorRange[0];
      },
    ),
    runOnJS: jest.fn(fn => fn),
    withTiming: jest.fn((value, _opts, callback) => {
      if (typeof callback === 'function')
        callback(true);
      return value;
    }),
    withSpring: jest.fn((value, _opts, callback) => {
      if (typeof callback === 'function')
        callback(true);
      return value;
    }),
    withDecay: jest.fn(value => value),
    withDelay: jest.fn((_, value) => value),
    withRepeat: jest.fn(value => value),
    withSequence: jest.fn((...values) => values[0]),
    cancelAnimation: jest.fn(),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      cubic: jest.fn(),
      bezier: jest.fn(),
      in: jest.fn(fn => fn),
      out: jest.fn(fn => fn),
      inOut: jest.fn(fn => fn),
    },
    FadeIn: { duration: jest.fn(() => ({})) },
    FadeOut: { duration: jest.fn(() => ({})) },
    FadeInDown: { duration: jest.fn(() => ({})) },
    FadeInUp: { duration: jest.fn(() => ({})) },
    FadeInLeft: { duration: jest.fn(() => ({})) },
    FadeInRight: { duration: jest.fn(() => ({})) },
    SlideInDown: { duration: jest.fn(() => ({})) },
    SlideInUp: { duration: jest.fn(() => ({})) },
    SlideInLeft: { duration: jest.fn(() => ({})) },
    SlideInRight: { duration: jest.fn(() => ({})) },
    Layout: {},
    Keyframe: jest.fn(),
  };
});

// Mock @react-navigation/native to avoid ESM parse errors in Jest
/* eslint-disable react/no-unnecessary-use-prefix -- mock exports match React Navigation hook names */
jest.mock('@react-navigation/native', () => {
  const navColors = {
    primary: '#000000',
    background: '#000000',
    card: '#000000',
    text: '#000000',
    border: '#000000',
    notification: '#000000',
  };
  const DarkTheme = { dark: true, colors: { ...navColors } };
  const DefaultTheme = { dark: false, colors: { ...navColors } };
  return {
    DarkTheme,
    DefaultTheme,
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
    useIsFocused: () => true,
    useRoute: () => ({}),
    createStaticNavigation: jest.fn(),
    NavigationContainer: ({ children }: { children: unknown }) => children,
  };
});
/* eslint-enable react/no-unnecessary-use-prefix */

jest.mock('@dev-plugins/react-query', () => ({
  useReactQueryDevTools: jest.fn(),
}));

// Mock expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [
    {
      languageTag: 'en-US',
      languageCode: 'en',
      textDirection: 'ltr',
      digitGroupingSeparator: ',',
      decimalSeparator: '.',
      measurementSystem: 'metric',
      currencyCode: 'USD',
      currencySymbol: '$',
      regionCode: 'US',
    },
  ]),
}));

// Mock react-native-mmkv
jest.mock('react-native-mmkv', () => ({
  MMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
    getAllKeys: jest.fn(() => []),
  })),
  useMMKVString: jest.fn((_key: string) => [undefined, jest.fn()]),
  useMMKVNumber: jest.fn((_key: string) => [undefined, jest.fn()]),
  useMMKVBoolean: jest.fn((_key: string) => [undefined, jest.fn()]),
  useMMKVObject: jest.fn((_key: string) => [undefined, jest.fn()]),
  createMMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getNumber: jest.fn(),
    getBoolean: jest.fn(),
    delete: jest.fn(),
    clearAll: jest.fn(),
    getAllKeys: jest.fn(() => []),
  })),
}));

// react-native-keychain — stable promises for unit tests (M2)
const keychainPasswordByService: Record<string, string> = {};
jest.mock('react-native-keychain', () => ({
  ACCESSIBLE: {
    WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
  },
  setGenericPassword: jest.fn(
    async (_username: string, password: string, options?: { service?: string }) => {
      const service = options?.service ?? '__default__';
      keychainPasswordByService[service] = password;
      return { service, storage: 'keychain' };
    },
  ),
  getGenericPassword: jest.fn(async (options?: { service?: string }) => {
    const service = options?.service ?? '__default__';
    const password = keychainPasswordByService[service];
    if (!password)
      return false;
    return {
      username: 'session',
      password,
      service,
      storage: 'keychain' as const,
    };
  }),
  resetGenericPassword: jest.fn(async (options?: { service?: string }) => {
    const service = options?.service ?? '__default__';
    delete keychainPasswordByService[service];
    return true;
  }),
}));

// Global window object setup for React Native testing
// @ts-expect-error
global.window = {};

// @ts-expect-error
global.window = global;
