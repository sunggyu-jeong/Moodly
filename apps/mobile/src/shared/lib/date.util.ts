import { Dayjs } from 'dayjs';

interface GenerateMonthGridProps {
  targetDate: Dayjs;
}

export const generateMonthGrid = ({ targetDate }: GenerateMonthGridProps): (Dayjs | null)[][] => {
  const daysInMonth = targetDate.daysInMonth();
  const firstDayOfMonth = targetDate.date(1);
  const firstDayWeekday = firstDayOfMonth.day();

  const weeks: (Dayjs | null)[][] = [];
  let currentWeek: (Dayjs | null)[] = new Array(7).fill(null);

  let day = 1;

  for (let i = firstDayWeekday; i < 7; i++) {
    currentWeek[i] = targetDate.date(day);
    day++;
  }

  weeks.push(currentWeek);

  while (day <= daysInMonth) {
    currentWeek = new Array(7).fill(null);
    for (let i = 0; i < 7 && day <= daysInMonth; i++) {
      currentWeek[i] = targetDate.date(day);
      day++;
    }
    weeks.push(currentWeek);
  }

  return weeks;
};

export const generateWeekGrid = ({ targetDate }: GenerateMonthGridProps): (Dayjs | null)[][] => {
  const startOfWeek = targetDate.startOf('week');
  const week: (Dayjs | null)[] = [];

  for (let i = 0; i < 7; i++) {
    week.push(startOfWeek.add(i, 'day'));
  }

  return [week];
};

export const formatWeekLabel = (weekStart: Dayjs): string => {
  const month = weekStart.month() + 1;

  // 일요일=0 기준으로, 해당 월의 "첫 주 시작(일요일)"을 계산
  const firstOfMonth = weekStart.startOf('month');
  const firstWeekStart = firstOfMonth.subtract(firstOfMonth.day(), 'day').startOf('day');

  const currentWeekStart = weekStart.subtract(weekStart.day(), 'day').startOf('day');
  const weekIndex = Math.floor(currentWeekStart.diff(firstWeekStart, 'day') / 7) + 1;

  return `${month}월 ${weekIndex}째주`;
};

export const getMonthRange = (date: Dayjs) => ({
  start: date.startOf('month').format('YYYY-MM-DD'),
  end: date.add(1, 'month').startOf('month').format('YYYY-MM-DD'),
});

export const getWeekRange = (weekStart: Dayjs) => ({
  start: weekStart.startOf('week').format('YYYY-MM-DD'),
  end: weekStart.endOf('week').add(1, 'day').format('YYYY-MM-DD'),
});
