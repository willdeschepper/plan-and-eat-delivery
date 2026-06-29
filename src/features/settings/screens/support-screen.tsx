import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { openLinkInBrowser } from '@/lib/utils';

import { SettingsSubScreenLayout } from '../components/settings-sub-screen-layout';
import { SupportContactCard } from '../components/support-contact-card';
import { SETTINGS_SUPPORT_CONTACTS } from '../lib/support-contacts';

export function SupportScreen() {
  const { t } = useTranslation();

  const handlePress = React.useCallback((href: string) => {
    void openLinkInBrowser(href);
  }, []);

  return (
    <SettingsSubScreenLayout titleTx="settings.support">
      <View style={styles.list}>
        {SETTINGS_SUPPORT_CONTACTS.map(contact => (
          <SupportContactCard
            key={contact.kind}
            kind={contact.kind}
            label={t(contact.labelTx)}
            value={contact.value}
            onPress={() => handlePress(contact.href)}
            testID={`settings-support-${contact.kind}`}
          />
        ))}
      </View>
    </SettingsSubScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
});
