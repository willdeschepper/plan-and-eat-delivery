import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { useAppTheme } from '@/lib/hooks/use-app-theme';

import { deleteAccountWithBackend } from '../api/use-delete-account';

type Props = {
  onClose: () => void;
};

export function DeleteAccountModalContent({ onClose }: Props) {
  const { t } = useTranslation();
  const { c } = useAppTheme();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = React.useCallback(() => {
    setIsDeleting(true);
    void (async () => {
      try {
        onClose();
        await deleteAccountWithBackend();
      }
      finally {
        setIsDeleting(false);
      }
    })();
  }, [onClose]);

  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: c.textPrimary }]}>
          {t('settings.delete_account_confirm.title')}
        </Text>
        <Text style={[styles.description, { color: c.textSecondary }]}>
          {t('settings.delete_account_confirm.description')}
        </Text>
      </View>
      <View style={styles.actions}>
        <Button
          variant="outline"
          size="lg"
          label={t('settings.delete_account_confirm.cancel')}
          onPress={onClose}
          disabled={isDeleting}
          style={styles.actionButton}
          testID="delete-account-cancel"
        />
        <Button
          size="lg"
          label={t('settings.delete_account_confirm.confirm')}
          onPress={handleConfirm}
          disabled={isDeleting}
          loading={isDeleting}
          style={[styles.actionButton, styles.deleteButton]}
          testID="delete-account-submit"
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
  deleteButton: {
    backgroundColor: '#E8313B',
    borderColor: '#E8313B',
  },
});
