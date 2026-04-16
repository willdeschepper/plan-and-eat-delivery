import type { CalendarDate } from './calendar-types';

import dayjs from 'dayjs';

export type BaseDayInfo = {
  date: CalendarDate;
  isCurrentMonth: boolean;
  isToday: boolean;
  isDisabledByMinMax: boolean;
};

export type MonthGrid = BaseDayInfo[][];

type BuildMonthGridParams = {
  year: number;
  month: number;
  firstDayOfWeek?: number;
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
};

export function buildMonthGrid({
  year,
  month,
  firstDayOfWeek = 0,
  minDate,
  maxDate,
}: BuildMonthGridParams): MonthGrid {
  const startOfMonth = dayjs().year(year).month(month).date(1).startOf('day');

  const today = dayjs().startOf('day');

  const firstWeekday = startOfMonth.day();
  const offset = (firstWeekday - firstDayOfWeek + 7) % 7;

  const totalCells = 6 * 7;

  const grid: MonthGrid = [];

  const min = minDate ? dayjs(minDate).startOf('day') : null;
  const max = maxDate ? dayjs(maxDate).startOf('day') : null;

  for (let cell = 0; cell < totalCells; cell += 1) {
    const rowIndex = Math.floor(cell / 7);
    if (!grid[rowIndex]) {
      grid[rowIndex] = [];
    }

    const dayOffset = cell - offset;
    const cellDate = startOfMonth.add(dayOffset, 'day');

    const isCurrentMonth = cellDate.month() === month && cellDate.year() === year;
    const isToday = cellDate.isSame(today, 'day');

    let isDisabledByMinMax = false;
    if (min && cellDate.isBefore(min, 'day')) {
      isDisabledByMinMax = true;
    }
    if (max && cellDate.isAfter(max, 'day')) {
      isDisabledByMinMax = true;
    }

    grid[rowIndex].push({
      date: cellDate.toDate(),
      isCurrentMonth,
      isToday,
      isDisabledByMinMax,
    });
  }

  return grid;
}
