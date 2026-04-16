import type { ComponentProps } from 'react';
import { Pressable } from 'react-native';

import { Home, Plus, User } from '@/components/icons';

const TAB_SIZE = 56;

const ICONS: Record<string, React.ComponentType<{ color: string }>> = {
  orders: Home,
  delivery: Plus,
  settings: User,
};

type TabBarButtonProps = ComponentProps<typeof Pressable> & {
  name: string;
  isFocused?: boolean;
};

export function TabBarButton({
  name,
  isFocused = false,
  ...pressableProps
}: TabBarButtonProps) {
  const Icon = ICONS[name] ?? Home;
  const borderColor = isFocused ? 'border-primary-400' : 'border-charcoal-200';
  const bgColor = isFocused ? 'bg-primary-50' : 'bg-white';
  const iconColor = isFocused ? '#FF8933' : '#616161';

  return (
    <Pressable
      {...pressableProps}
      style={{ width: TAB_SIZE, height: TAB_SIZE }}
      className={`items-center justify-center rounded-full border-2 ${borderColor} ${bgColor}`}
    >
      <Icon color={iconColor} />
    </Pressable>
  );
}
