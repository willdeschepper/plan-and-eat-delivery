import type { CalendarDayState, CalendarProps, CalendarRenderDayProps } from './calendar-types';

import type { BaseDayInfo } from './calendar-utils';
import { MotiView } from 'moti';
import * as React from 'react';
import { CalendarDayDefault } from './calendar-day-default';
import { CalendarGrid } from './calendar-grid';
import { buildMonthGrid } from './calendar-utils';

export function Calendar({
  year,
  month,
  firstDayOfWeek = 0,
  minDate,
  maxDate,
  isDateDisabled,
  isDateSelected,
  getDateMeta,
  onDayPress,
  renderDay,
}: CalendarProps): React.JSX.Element {
  const grid = React.useMemo(
    () =>
      buildMonthGrid({
        year,
        month,
        firstDayOfWeek,
        minDate,
        maxDate,
      }),
    [year, month, firstDayOfWeek, minDate, maxDate],
  );

  const DayComponent = renderDay ?? CalendarDayDefault;

  const resolveDayState = React.useCallback(
    (base: BaseDayInfo): CalendarDayState => {
      const { date, isCurrentMonth, isToday, isDisabledByMinMax } = base;

      const disabledByPredicate = isDateDisabled
        ? isDateDisabled(date)
        : false;

      const selected = isDateSelected ? isDateSelected(date) : false;

      const meta = getDateMeta ? getDateMeta(date) : {};

      return {
        date,
        isCurrentMonth,
        isToday,
        isDisabled: isDisabledByMinMax || disabledByPredicate,
        isSelected: selected,
        ...meta,
      };
    },
    [getDateMeta, isDateDisabled, isDateSelected],
  );

  const renderDayNode = React.useCallback(
    (props: CalendarRenderDayProps) => <DayComponent {...props} />,
    [DayComponent],
  );

  return (
    <MotiView
      key={`${year}-${month}`}
      from={{ opacity: 0, translateY: -4 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 180 }}
    >
      <CalendarGrid
        grid={grid}
        resolveDayState={resolveDayState}
        renderDay={renderDayNode}
        onDayPress={onDayPress}
      />
    </MotiView>
  );
}
