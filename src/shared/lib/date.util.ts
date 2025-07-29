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
