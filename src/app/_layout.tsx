import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { NetworkConnectivityHost } from '@/components/network/network-connectivity-host';
import { GlobalDialogHost } from '@/components/ui/global-dialog-host';
import { GlobalModalHost } from '@/components/ui/global-modal-host';
import { LoadingHost } from '@/components/ui/loader';
import { rootToastConfig } from '@/components/ui/toast-config';
import { TOAST_VISIBILITY_MS } from '@/components/ui/toast-constants';
import { useThemeConfig } from '@/components/ui/use-theme-config';
import { APIProvider } from '@/lib/api';
import { runAuthBootstrap } from '@/lib/auth/bootstrap-auth';
import { loadSelectedTheme } from '@/lib/hooks/use-selected-theme';
// Import  global CSS file
import '../global.css';

export { ErrorBoundary } from 'expo-router';

// eslint-disable-next-line react-refresh/only-export-components
export const unstable_settings = {
  initialRouteName: '(app)',
};

loadSelectedTheme();
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

function AuthBootstrapEffect() {
  React.useEffect(() => {
    void (async () => {
      await runAuthBootstrap();
      await SplashScreen.hideAsync();
    })();
  }, []);
  return null;
}

export default function RootLayout() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="password-changed-success" options={{ headerShown: false }} />
        <Stack.Screen name="registration-success" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="verify-otp" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  const insets = useSafeAreaInsets();
  const toastTopOffset = Math.max(insets.top + 12, 16);

  return (
    <GestureHandlerRootView
      style={styles.container}
      // eslint-disable-next-line better-tailwindcss/no-unknown-classes
      className={theme.dark ? `dark` : undefined}
    >
      <KeyboardProvider>
        <ThemeProvider value={theme}>
          <APIProvider>
            <AuthBootstrapEffect />
            <BottomSheetModalProvider>
              <View style={styles.fill}>
                <NetworkConnectivityHost />
                {children}
              </View>
              <LoadingHost />
              <GlobalDialogHost />
              <GlobalModalHost />
              <Toast
                config={rootToastConfig}
                position="top"
                topOffset={toastTopOffset}
                visibilityTime={TOAST_VISIBILITY_MS}
              />
            </BottomSheetModalProvider>
          </APIProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
});
