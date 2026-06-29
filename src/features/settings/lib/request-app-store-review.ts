import Env from 'env';
import { Linking, Platform } from 'react-native';

type StoreReviewModule = typeof import('expo-store-review');

function loadStoreReview(): StoreReviewModule | null {
  try {
    // eslint-disable-next-line ts/no-require-imports
    return require('expo-store-review') as StoreReviewModule;
  }
  catch {
    return null;
  }
}

export async function requestAppStoreReview(): Promise<void> {
  const StoreReview = loadStoreReview();

  if (StoreReview) {
    try {
      if (await StoreReview.isAvailableAsync()) {
        await StoreReview.requestReview();
        return;
      }
    }
    catch {
      // ignore — fall through to Play Store on Android
    }
  }

  if (Platform.OS !== 'android') {
    return;
  }

  const storeUrl = `https://play.google.com/store/apps/details?id=${Env.EXPO_PUBLIC_PACKAGE}`;
  const canOpen = await Linking.canOpenURL(storeUrl);

  if (canOpen) {
    await Linking.openURL(storeUrl);
  }
}
