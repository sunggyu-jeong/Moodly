import dayjs, { Dayjs } from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
const SEOUL_TIMEZONE = 'Asia/Seoul';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(SEOUL_TIMEZONE);

export const now = (input?: dayjs.ConfigType): Dayjs => {
  return dayjs(input);
};

export const formatDate = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD');
};

export const formatDateTime = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD HH:mm:ss');
};
