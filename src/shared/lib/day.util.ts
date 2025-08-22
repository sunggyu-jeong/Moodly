import dayjs, { Dayjs } from 'dayjs';

export const d = (input?: dayjs.ConfigType) => (input ? dayjs(input) : dayjs()).tz();

export const toKstDate = (input?: dayjs.ConfigType) =>
  dayjs.tz(input, 'Asia/Seoul').format('YYYY-MM-DD');

export const toDateOnly = (v?: string): string => {
  if (!v) return toKstDate();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return toKstDate(v);
};

export const toDateOnlyKST = (value: string | Date) =>
  dayjs(value).tz('Asia/Seoul').format('YYYY-MM-DD');

export const createKstDay = (input?: dayjs.ConfigType): Dayjs => {
  return dayjs.tz(input, 'Asia/Seoul');
};
