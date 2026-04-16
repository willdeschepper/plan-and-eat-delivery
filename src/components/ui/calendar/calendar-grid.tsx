import type { CalendarDayState, CalendarRenderDay } from './calendar-types';
import type { MonthGrid } from './calendar-utils';

import * as React from 'react';
import { View } from 'react-native';

type CalendarGridProps = {
  grid: MonthGrid;
  resolveDayState: (base: {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isDisabledByMinMax: boolean;
  }) => CalendarDayState;
  renderDay: CalendarRenderDay;
  onDayPress?: (date: Date, state: CalendarDayState) => void;
};

export function CalendarGrid({
  grid,
  resolveDayState,
  renderDay,
  onDayPress,
}: CalendarGridProps): React.JSX.Element {
  return (
    <View className="flex-row flex-wrap">
      {grid.map((row, rowIndex) =>
        row.map((base, columnIndex) => {
          const key = `${rowIndex}-${columnIndex}-${base.date.toISOString()}`;
          const state = resolveDayState(base);

          const handlePress = () => {
            if (state.isDisabled) {
              return;
            }
            if (onDayPress) {
              onDayPress(state.date, state);
            }
          };

          return (
            <View
              key={key}
              style={{ width: `${100 / 7}%` }}
              className="items-center justify-center py-[6px]"
            >
              {renderDay({
                ...state,
                onPress: handlePress,
              })}
            </View>
          );
        }),
      )}
    </View>
  );
}
