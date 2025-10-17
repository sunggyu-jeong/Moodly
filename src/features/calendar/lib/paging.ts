import type { Diary } from '@/entities/diary/model/diary.types';
import { Dayjs } from 'dayjs';

export type CalendarPageKey = 'prev' | 'current' | 'next';

export type CalendarPage = {
  key: CalendarPageKey;
  periodStart: Dayjs;
  items: Diary[];
};

type BuildPageArgs = {
  mode: 'month' | 'week';
  selectedDayIso?: string | null;
  prevPeriod: Dayjs;
  currPeriod: Dayjs;
  nextPeriod: Dayjs;
  prevData: Diary[];
  currData: Diary[];
  nextData: Diary[];
};

export const buildPages = ({
  prevPeriod,
  currPeriod,
  nextPeriod,
  prevData,
  currData,
  nextData,
}: BuildPageArgs) => {
  const toPage = (key: CalendarPageKey, period: Dayjs, data: Diary[]) => ({
    key,
    periodStart: period,
    items: data,
  });

  return [
    toPage('prev', prevPeriod, prevData),
    toPage('current', currPeriod, currData),
    toPage('next', nextPeriod, nextData),
  ];
};
