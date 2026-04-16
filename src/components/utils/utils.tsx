import dayjs from 'dayjs';
import { Platform } from 'react-native';

export const currentMonth = dayjs().month();
export const currentMonthLabel = dayjs().month(currentMonth).format('MMMM');
export const currentYear = dayjs().year();

export const isIphone = Platform.OS === 'ios';
