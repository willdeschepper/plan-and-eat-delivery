import type { SettingsItem } from './hooks/use-settings-menu-items';
import Env from 'env';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/lib/hooks/use-app-theme';

import { SettingsMenuRow } from './components/settings-menu-row';
import { SettingsScreenHeader } from './components/settings-screen-header';
import { SettingsSection } from './components/settings-section';
import { useLogoutConfirmModal } from './hooks/use-logout-confirm-modal';
import { useSettingsDisplayLabels } from './hooks/use-settings-display-labels';
import { useSettingsMenuItems } from './hooks/use-settings-menu-items';

export function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { isDark, c } = useAppTheme();
  const { generalItems, supportItems, legalItems } = useSettingsMenuItems();
  const { languageLabel, themeLabel } = useSettingsDisplayLabels();
  const { openLogoutConfirm } = useLogoutConfirmModal();

  const presentModal = React.useCallback(() => {
    openLogoutConfirm();
  }, [openLogoutConfirm]);

  const handlePress = React.useCallback(
    (item: SettingsItem) => {
      if (item.kind === 'navigate') {
        router.push(item.route);
      }
      else {
        presentModal();
      }
    },
    [router, presentModal],
  );

  const valueForItem = React.useCallback(
    (item: SettingsItem) => {
      if (item.testID === 'settings-language') return languageLabel;
      if (item.testID === 'settings-theme') return themeLabel;
      return undefined;
    },
    [languageLabel, themeLabel],
  );

  const renderItems = (items: SettingsItem[]) =>
    items.map((item, index) => (
      <SettingsMenuRow
        key={item.kind === 'navigate' ? `nav-${item.route}` : `modal-${item.modal}`}
        labelTx={item.tx}
        value={valueForItem(item)}
        onPress={() => handlePress(item)}
        isLast={index === items.length - 1}
        testID={item.testID}
      />
    ));

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <SettingsScreenHeader title={t('settings.title')} />
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection titleTx="settings.general">
          {renderItems(generalItems)}
        </SettingsSection>

        <SettingsSection titleTx="settings.about">
          <SettingsMenuRow
            labelTx="settings.app_name"
            value={Env.EXPO_PUBLIC_NAME}
            isLast={false}
            testID="settings-app-name"
          />
          <SettingsMenuRow
            labelTx="settings.version"
            value={Env.EXPO_PUBLIC_VERSION}
            isLast
            testID="settings-version"
          />
        </SettingsSection>


        <SettingsSection titleTx="settings.legal">
          {renderItems(legalItems)}
        </SettingsSection>

        <Pressable
          testID="settings-logout"
          style={({ pressed }) => [
            styles.logoutBtn,
            {
              opacity: pressed ? 0.75 : 1,
              borderColor: isDark ? 'rgba(232,49,59,0.3)' : '#FECACA',
              backgroundColor: isDark ? 'rgba(232,49,59,0.08)' : '#FEF2F2',
            },
          ]}
          onPress={presentModal}
        >
          <Text style={styles.logoutText}>{t('settings.logout')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 20,
  },
  logoutBtn: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  logoutText: {
    color: '#E8313B',
    fontSize: 16,
    fontWeight: '600',
  },
});
