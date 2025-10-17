import { Dayjs } from 'dayjs';

export const getMonthRange = (date: Dayjs) => ({
  start: date.startOf('month').format('YYYY-MM-DD'),
  end: date.add(1, 'month').startOf('month').format('YYYY-MM-DD'),
});

export const getWeekRange = (weekStart: Dayjs) => ({
  start: weekStart.startOf('week').format('YYYY-MM-DD'),
  end: weekStart.endOf('week').add(1, 'day').format('YYYY-MM-DD'),
});
