import Toast from 'react-native-toast-message';

import { TOAST_VISIBILITY_MS } from '@/components/ui/toast-constants';

export function showErrorMessage(
  message: string = 'Something went wrong',
  description?: string,
): void {
  Toast.show({
    type: 'error',
    text1: message,
    text2: description,
    visibilityTime: TOAST_VISIBILITY_MS,
    position: 'top',
  });
}
