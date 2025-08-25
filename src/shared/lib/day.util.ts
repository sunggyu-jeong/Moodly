import dayjs, { Dayjs } from 'dayjs';

export function now(): Dayjs;
export function now(input: dayjs.ConfigType): Dayjs;
export function now(input?: dayjs.ConfigType): Dayjs {
  if (input) {
    return dayjs.utc(input).tz('Asia/Seoul');
  }
  return dayjs().tz('Asia/Seoul');
}

export const formatDate = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD');
};

export const formatDateTime = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD HH:mm:ss');
};
