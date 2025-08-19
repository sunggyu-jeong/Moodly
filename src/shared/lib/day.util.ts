import dayjs from 'dayjs';

export const d = (input?: dayjs.ConfigType) => (input ? dayjs(input) : dayjs()).tz();

export const toKstDate = (input?: dayjs.ConfigType) => d(input).format('YYYY-MM-DD');

export const nowISOUtc = () => dayjs().toISOString();

export const toDateOnly = (v?: string): string => {
  if (!v) return toKstDate();
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return toKstDate(v);
};
