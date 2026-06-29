import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { logoutWithBackend } from '@/features/auth/logout';
import { useAppTheme } from '@/lib/hooks/use-app-theme';

type Props = {
  onClose: () => void;
};

export function LogoutConfirmModalContent({ onClose }: Props) {
  const { t } = useTranslation();
  const { c } = useAppTheme();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleConfirm = React.useCallback(() => {
    setIsLoggingOut(true);
    void (async () => {
      try {
        onClose();
        await logoutWithBackend();
      }
      finally {
        setIsLoggingOut(false);
      }
    })();
  }, [onClose]);

  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: c.textPrimary }]}>
          {t('settings.logout_confirm.title')}
        </Text>
        <Text style={[styles.description, { color: c.textSecondary }]}>
          {t('settings.logout_confirm.description')}
        </Text>
      </View>
      <View style={styles.actions}>
        <Button
          variant="outline"
          size="lg"
          label={t('settings.logout_confirm.cancel')}
          onPress={onClose}
          disabled={isLoggingOut}
          style={styles.actionButton}
          testID="logout-confirm-cancel"
        />
        <Button
          size="lg"
          label={t('settings.logout_confirm.confirm')}
          onPress={handleConfirm}
          disabled={isLoggingOut}
          loading={isLoggingOut}
          style={styles.actionButton}
          testID="logout-confirm-submit"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  textBlock: {
    gap: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  actionButton: {
    height: 54,
    flex: 1,
  },
});
