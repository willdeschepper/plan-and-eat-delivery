import type { ModalEntry, ModalPolicy } from '@/lib/hooks/use-global-modal-store';

import * as React from 'react';
import {
  BackHandler,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useGlobalModalStore } from '@/lib/hooks/use-global-modal-store';

function getTopDialogEntry(stack: ModalEntry[]): ModalEntry | null {
  const top = stack[stack.length - 1];
  return top?.presentation === 'dialog' ? top : null;
}

export function GlobalDialogHost() {
  const stack = useGlobalModalStore(state => state.stack);
  const closeTop = useGlobalModalStore(state => state.closeTop);
  const closeAllFromStore = useGlobalModalStore(state => state.closeAll);
  const openFromStore = useGlobalModalStore(state => state.open);

  const currentEntry = getTopDialogEntry(stack);
  const isVisible = currentEntry !== null;

  const maxHeightPercent = currentEntry?.maxHeightPercent ?? 0.85;
  const dismissOnBackdrop = currentEntry?.dismissOnBackdrop ?? true;
  const dismissOnBack = currentEntry?.dismissOnBack ?? true;

  const screenHeight = Dimensions.get('window').height;
  const maxHeight = screenHeight * maxHeightPercent;

  const handleClose = React.useCallback(() => {
    closeTop();
  }, [closeTop]);

  const handleCloseAll = React.useCallback(() => {
    closeAllFromStore();
  }, [closeAllFromStore]);

  const handleReplace = React.useCallback(
    (entry: ModalEntry, policy?: ModalPolicy) => {
      openFromStore(entry, policy ?? 'replace');
    },
    [openFromStore],
  );

  const handleBackdropPress = React.useCallback(() => {
    if (dismissOnBackdrop) {
      handleClose();
    }
  }, [dismissOnBackdrop, handleClose]);

  React.useEffect(() => {
    if (!isVisible || !dismissOnBack) {
      return undefined;
    }
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      handleClose();
      return true;
    });
    return () => sub.remove();
  }, [isVisible, dismissOnBack, handleClose]);

  if (!currentEntry) {
    return null;
  }

  const { render, payload, contentContainerStyle } = currentEntry;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={dismissOnBack ? handleClose : undefined}
    >
      <Pressable
        style={styles.backdrop}
        onPress={handleBackdropPress}
        accessibilityLabel="Close modal"
        accessibilityRole="button"
      >
        <Pressable
          style={[styles.cardWrapper, { maxHeight }]}
          onPress={e => e.stopPropagation()}
        >
          <View
            className="overflow-hidden rounded-3xl bg-white dark:bg-neutral-800"
            style={[
              styles.card,
              contentContainerStyle,
              { maxHeight },
            ]}
          >
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps="handled"
            >
              {render({
                close: handleClose,
                closeAll: handleCloseAll,
                replace: handleReplace,
                payload,
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  card: {
    flexShrink: 1,
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
    maxHeight: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
});
