import type * as React from 'react';

export type CalendarDate = Date;

export type CalendarDayState = {
  date: CalendarDate;
  isCurrentMonth: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  isWorking?: boolean;
  isDayOff?: boolean;
};

export type CalendarRenderDayProps = CalendarDayState & {
  onPress: () => void;
};

export type CalendarRenderDay = (
  props: CalendarRenderDayProps,
) => React.ReactNode;

export type CalendarProps = {
  year: number;
  month: number;
  firstDayOfWeek?: number;
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
  isDateDisabled?: (date: CalendarDate) => boolean;
  isDateSelected?: (date: CalendarDate) => boolean;
  getDateMeta?: (
    date: CalendarDate,
  ) => Partial<Pick<CalendarDayState, 'isStart' | 'isEnd' | 'isWorking' | 'isDayOff'>>;
  onDayPress?: (date: CalendarDate, state: CalendarDayState) => void;
  renderDay?: CalendarRenderDay;
};
