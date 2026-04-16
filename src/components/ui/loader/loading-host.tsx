import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  cancelAnimation,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { PlanEatFillLogo } from '@/components/ui/loader/plan-eat-fill-logo';
import { useGlobalLoaderStore } from '@/lib/hooks/use-global-loader-store';

const LOADER_BADGE_SIZE = 189;
const LOADER_BADGE_PADDING = 18;
const INDETERMINATE_CYCLE_MS = 2200;
const DETERMINATE_STEP_MS = 360;

export function LoadingHost(): React.ReactElement | null {
  // const visible = useGlobalLoaderStore(state => state.visible);
  const visible = true;
  const mode = useGlobalLoaderStore(state => state.mode);
  const storeProgress = useGlobalLoaderStore(state => state.progress);

  const fillProgress = useSharedValue(0);

  React.useEffect(() => {
    if (!visible) {
      cancelAnimation(fillProgress);
      fillProgress.value = 0;
      return;
    }

    if (mode === 'indeterminate') {
      cancelAnimation(fillProgress);
      fillProgress.value = 0;
      fillProgress.value = withRepeat(
        withTiming(1, { duration: INDETERMINATE_CYCLE_MS }),
        -1,
        false,
      );
      return () => {
        cancelAnimation(fillProgress);
      };
    }

    cancelAnimation(fillProgress);
    fillProgress.value = withTiming(storeProgress, { duration: DETERMINATE_STEP_MS });
    return () => {
      cancelAnimation(fillProgress);
    };
  }, [visible, mode, storeProgress, fillProgress]);

  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents="auto" style={styles.overlay}>
      <View style={styles.badge}>
        <PlanEatFillLogo fillProgress={fillProgress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'white',
    width: LOADER_BADGE_SIZE,
    height: LOADER_BADGE_SIZE,
    borderRadius: LOADER_BADGE_SIZE / 2,
    padding: LOADER_BADGE_PADDING,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
