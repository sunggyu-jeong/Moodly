import dayjs, { Dayjs } from 'dayjs';

export const generateMonthGrid = (monthIndex: number): (Dayjs | null)[][] => {
  const year = 2025;
  const daysInMonth = dayjs().year(year).month(monthIndex).daysInMonth();
  const firstDayOfMonth = dayjs().year(year).month(monthIndex).date(1);
  const firstDayWeekday = firstDayOfMonth.day();

  const weeks: (Dayjs | null)[][] = [];
  let currentWeek: (Dayjs | null)[] = new Array(7).fill(null);

  let day = 1;

  for (let i = firstDayWeekday; i < 7; i++) {
    currentWeek[i] = dayjs().year(year).month(monthIndex).date(day);
    day++;
  }

  weeks.push(currentWeek);

  while (day <= daysInMonth) {
    currentWeek = new Array(7).fill(null);
    for (let i = 0; i < 7 && day <= daysInMonth; i++) {
      currentWeek[i] = dayjs().year(year).month(monthIndex).date(day);
      day++;
    }
    weeks.push(currentWeek);
  }

  return weeks;
};
