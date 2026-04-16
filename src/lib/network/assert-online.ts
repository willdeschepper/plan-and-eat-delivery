import Toast from 'react-native-toast-message';

import { TOAST_VISIBILITY_MS } from '@/components/ui/toast-constants';
import { translate } from '@/lib/i18n/utils';

import { getIsOnline } from './network-status';

const ASSERT_ONLINE_THROTTLE_MS = 4000;

let lastAssertToastAt = 0;

/**
 * Blocks offline actions (M1-E). Toast text 2.3; throttled globally.
 * @returns true if online and caller may proceed
 */
export function assertOnline(): boolean {
  if (getIsOnline()) {
    return true;
  }
  const now = Date.now();
  if (now - lastAssertToastAt < ASSERT_ONLINE_THROTTLE_MS) {
    return false;
  }
  lastAssertToastAt = now;
  Toast.show({
    type: 'error',
    text1: translate('network.action_offline'),
    visibilityTime: TOAST_VISIBILITY_MS,
    position: 'top',
  });
  return false;
}
