import { Diary } from '@entities/diary/model/diary.types';
import { isNotEmpty } from '@shared/lib';
import dayjs, { Dayjs } from 'dayjs';

export type CalendarPageKey = 'prev' | 'current' | 'next';

export type CalendarPage = {
  key: CalendarPageKey;
  periodStart: Dayjs;
  items: Diary[];
  currentItems: Diary[];
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
  mode,
  selectedDayIso,
  prevPeriod,
  currPeriod,
  nextPeriod,
  prevData,
  currData,
  nextData,
}: BuildPageArgs) => {
  const filterBySelected = (list: Diary[]) => {
    if (!isNotEmpty(selectedDayIso)) {
      return list;
    }
    return list.filter(e => dayjs(e.createdAt).isSame(dayjs(selectedDayIso), 'day'));
  };

  const toPage = (key: CalendarPageKey, period: Dayjs, data: Diary[]) => ({
    key,
    periodStart: period,
    items: data,
    currentItems: filterBySelected(data),
  });

  return [
    toPage('prev', prevPeriod, prevData),
    toPage('current', currPeriod, currData),
    toPage('next', nextPeriod, nextData),
  ];
};
