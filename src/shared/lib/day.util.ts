import dayjs, { Dayjs } from 'dayjs';

export const d = (input?: dayjs.ConfigType): Dayjs => {
  return dayjs(input);
};

export const toKstDate = (input?: dayjs.ConfigType): string => {
  return dayjs(input).format('YYYY-MM-DD');
};

export const toDateOnly = (v?: string): string => {
  if (!v) return toKstDate();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return toKstDate(v);
};

export const createKstDay = (input?: dayjs.ConfigType): Dayjs => {
  return dayjs.tz(input, 'Asia/Seoul');
};
