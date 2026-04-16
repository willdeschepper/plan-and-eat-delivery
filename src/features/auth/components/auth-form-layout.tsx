import type { ViewStyle } from 'react-native';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

export type AuthFormLayoutProps = {
  children: React.ReactNode;
  contentClassName?: string;
  style?: ViewStyle;
  keyboardVerticalOffset?: number;
};

export function AuthFormLayout({
  children,
  contentClassName = 'flex-1 px-4 pt-10',
  style,
}: AuthFormLayoutProps) {
  return (
    <ScrollView
      style={[{ flex: 1 }, style]}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="none"
    >
      <View className={contentClassName}>
        {children}
      </View>
    </ScrollView>
  );
}
