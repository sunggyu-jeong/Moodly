import { Dayjs } from 'dayjs';

interface GenerateMonthGridProps {
  targetDate: Dayjs;
}

export const generateMonthGrid = ({ targetDate }: GenerateMonthGridProps): (Dayjs | null)[][] => {
  const cleanDate = targetDate.clone().startOf('day');
  const daysInMonth = cleanDate.daysInMonth();
  const firstDayOfMonth = cleanDate.date(1);
  const firstDayWeekday = firstDayOfMonth.day();

  const weeks: (Dayjs | null)[][] = [];
  let currentWeek: (Dayjs | null)[] = new Array(7).fill(null);

  let day = 1;

  for (let i = firstDayWeekday; i < 7; i++) {
    const cellDate = targetDate.clone().date(day).startOf('day');
    currentWeek[i] = cellDate;
    day++;
  }

  weeks.push(currentWeek);

  while (day <= daysInMonth) {
    currentWeek = new Array(7).fill(null);
    for (let i = 0; i < 7 && day <= daysInMonth; i++) {
      const cellDate = targetDate.clone().date(day).startOf('day');
      currentWeek[i] = cellDate;
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
