import * as React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { TOAST_VISIBILITY_MS } from '@/components/ui/toast-constants';
import { translate } from '@/lib/i18n/utils';
import { useNetworkStatus } from '@/lib/network/use-network-status';

/**
 * Persistent offline strip (M1-B) + success toast when debounced connectivity returns (1.1).
 */
export function NetworkConnectivityHost(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const isOnline = useNetworkStatus();
  const previousOnlineRef = React.useRef<boolean | undefined>(undefined);

  React.useEffect(() => {
    if (previousOnlineRef.current === undefined) {
      previousOnlineRef.current = isOnline;
      return;
    }
    if (previousOnlineRef.current === false && isOnline === true) {
      Toast.show({
        type: 'success',
        text1: translate('network.connection_restored'),
        visibilityTime: TOAST_VISIBILITY_MS,
        position: 'top',
      });
    }
    previousOnlineRef.current = isOnline;
  }, [isOnline]);

  if (isOnline) {
    return null;
  }

  return (
    <View
      className="border-b border-red-800/30 bg-red-600 px-4 py-2"
      style={{ paddingTop: Math.max(insets.top, 8) }}
    >
      <Text
        accessibilityRole="alert"
        className="text-center font-sans text-sm font-semibold text-white"
      >
        {translate('network.offline_banner')}
      </Text>
    </View>
  );
}
