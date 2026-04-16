import type { CalendarRenderDayProps } from './calendar-types';
import { MotiView } from 'moti';
import * as React from 'react';

import { Pressable } from 'react-native';

import { Text } from '@/components/ui';

type DayVisualStateProps = {
  isSelected: boolean;
  isDisabled: boolean;
  isCurrentMonth: boolean;
  isToday: boolean;
  isDayOff?: boolean;
};

function getDayVisualState({
  isSelected,
  isDisabled,
  isCurrentMonth,
  isToday,
  isDayOff,
}: DayVisualStateProps) {
  let textColor = '#555555';
  if (!isCurrentMonth) {
    textColor = '#CECECE';
  }
  else if (isDisabled) {
    textColor = '#A9A9A9';
  }
  else if (isSelected || isDayOff) {
    textColor = '#FFFFFF';
  }

  let backgroundColor = 'transparent';
  if (isSelected && !isDayOff) {
    backgroundColor = '#2C583A';
  }
  else if (isDayOff) {
    backgroundColor = '#E8313B';
  }

  const borderColor = isToday ? 'transparent' : 'transparent';

  const containerOpacity = isDisabled ? 0.6 : 1;

  return {
    textColor,
    backgroundColor,
    borderColor,
    containerOpacity,
  };
}

export function CalendarDayDefault({
  date,
  isSelected,
  isDisabled,
  isCurrentMonth,
  isToday,
  isDayOff,
  onPress,
}: CalendarRenderDayProps): React.JSX.Element {
  const dayLabel = React.useMemo(
    () => date.getDate().toString(),
    [date],
  );

  const {
    textColor,
    backgroundColor,
    borderColor,
    containerOpacity,
  } = React.useMemo(
    () =>
      getDayVisualState({
        isSelected,
        isDisabled,
        isCurrentMonth,
        isToday,
        isDayOff,
      }),
    [isCurrentMonth, isDayOff, isDisabled, isSelected, isToday],
  );

  const handlePress = React.useCallback(() => {
    if (isDisabled) {
      return;
    }
    onPress();
  }, [isDisabled, onPress]);

  return (
    <Pressable onPress={handlePress}>
      <MotiView
        animateInitialState
        from={{ scale: 0.96 }}
        animate={{
          scale: isSelected || isDayOff ? 1 : 0.98,
          backgroundColor,
          borderColor,
        }}
        transition={{ type: 'timing', duration: 160 }}
        style={{
          borderRadius: 15,
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderWidth: isToday ? 1 : 0,
          opacity: containerOpacity,
        }}
      >
        <Text className="text-sm font-normal" style={{ color: textColor }}>
          {dayLabel}
        </Text>
      </MotiView>
    </Pressable>
  );
}
