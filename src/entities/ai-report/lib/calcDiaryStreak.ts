import dayjs from 'dayjs';

type RawRecord = { record_date: string };

export function calcDiaryStreak(baseDate: string, rows: RawRecord[]) {
  const uniqueSorted = Array.from(new Set(rows.map(r => r.record_date))).sort((a, b) =>
    dayjs(b).diff(dayjs(a), 'day'),
  );

  const consecutiveDates: string[] = [];
  let cursor = dayjs(baseDate);

  for (const dateStr of uniqueSorted) {
    const current = dayjs(dateStr);

    if (current.isSame(cursor, 'day')) {
      consecutiveDates.push(current.format('YYYY-MM-DD'));
      cursor = cursor.subtract(1, 'day');
    } else if (current.isBefore(cursor, 'day')) {
      break;
    } else {
      continue;
    }
  }

  return {
    streakCount: consecutiveDates.length,
    dates: consecutiveDates,
  };
}
