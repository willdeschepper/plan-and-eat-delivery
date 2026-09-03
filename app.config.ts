/* eslint-disable max-lines-per-function */
import type { ConfigContext, ExpoConfig } from '@expo/config';
import type { AppIconBadgeConfig } from 'app-icon-badge/types';

import 'tsx/cjs';

// tsx/cjs must be loaded before env.ts is imported.
// eslint-disable-next-line perfectionist/sort-imports
import Env from './env';

const EXPO_ACCOUNT_OWNER = 'willdeschepper';

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: Env.EXPO_PUBLIC_APP_ENV !== 'production',
  badges: [],
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const easProjectId = Env.EAS_PROJECT_ID;

  return {
    ...config,
    name: Env.EXPO_PUBLIC_NAME,
    description: `${Env.EXPO_PUBLIC_NAME} Mobile App`,
    owner: EXPO_ACCOUNT_OWNER,
    scheme: Env.EXPO_PUBLIC_SCHEME,
    slug: 'plan-and-eat-courier',
    version: Env.EXPO_PUBLIC_VERSION.toString(),
    orientation: 'portrait',
    icon: './assets/splash-icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    updates: easProjectId
      ? {
          url: `https://u.expo.dev/${easProjectId}`,
          fallbackToCacheTimeout: 0,
        }
      : { enabled: false },
    runtimeVersion: Env.EXPO_PUBLIC_VERSION.toString(),
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: Env.EXPO_PUBLIC_BUNDLE_ID,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          'We use your location to show nearby delivery options and center the map.',
      },
      config: {
        googleMapsApiKey: Env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS,
      },
    },
    experiments: {
      typedRoutes: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      googleServicesFile: './google-services.json',
      package: Env.EXPO_PUBLIC_PACKAGE,
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'POST_NOTIFICATIONS',
      ],
      config: {
        googleMaps: {
          apiKey: Env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID,
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      [
        'expo-splash-screen',
        {
          image: './assets/splash-icon.png',
          imageWidth: 150,
          backgroundColor: '#ffffff',
        },
      ],
      [
        'expo-font',
        {
          ios: {
            fonts: [
              'node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf',
              'node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf',
              'node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf',
              'node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf',
              'node_modules/@expo-google-fonts/montserrat/400Regular/Montserrat_400Regular.ttf',
              'node_modules/@expo-google-fonts/montserrat/600SemiBold/Montserrat_600SemiBold.ttf',
              'node_modules/@expo-google-fonts/montserrat/700Bold/Montserrat_700Bold.ttf',
              'node_modules/@expo-google-fonts/montserrat-alternates/400Regular/MontserratAlternates_400Regular.ttf',
              'node_modules/@expo-google-fonts/montserrat-alternates/600SemiBold/MontserratAlternates_600SemiBold.ttf',
            ],
          },
          android: {
            fonts: [
              {
                fontFamily: 'Inter',
                fontDefinitions: [
                  { path: 'node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf', weight: 400 },
                  { path: 'node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf', weight: 500 },
                  { path: 'node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf', weight: 600 },
                  { path: 'node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf', weight: 700 },
                ],
              },
              {
                fontFamily: 'Montserrat',
                fontDefinitions: [
                  { path: 'node_modules/@expo-google-fonts/montserrat/400Regular/Montserrat_400Regular.ttf', weight: 400 },
                  { path: 'node_modules/@expo-google-fonts/montserrat/600SemiBold/Montserrat_600SemiBold.ttf', weight: 600 },
                  { path: 'node_modules/@expo-google-fonts/montserrat/700Bold/Montserrat_700Bold.ttf', weight: 700 },
                ],
              },
              {
                fontFamily: 'Montserrat Alternates',
                fontDefinitions: [
                  { path: 'node_modules/@expo-google-fonts/montserrat-alternates/400Regular/MontserratAlternates_400Regular.ttf', weight: 400 },
                  { path: 'node_modules/@expo-google-fonts/montserrat-alternates/600SemiBold/MontserratAlternates_600SemiBold.ttf', weight: 600 },
                ],
              },
            ],
          },
        },
      ],
      'expo-localization',
      'expo-router',
      ['app-icon-badge', appIconBadgeConfig],
      ['react-native-edge-to-edge'],
      [
        'expo-notifications',
        {
          icon: './assets/splash-icon.png',
          color: '#FF6C00',
        },
      ],
    ],
    extra: easProjectId
      ? { eas: { projectId: easProjectId } }
      : {},
  };
};
