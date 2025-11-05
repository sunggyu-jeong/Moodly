import { diaryApi } from '@/entities/diary/api/diary.api';
import { now } from '@/shared/lib/day.util';
import { createSelector } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

type CalendarMode = 'month' | 'week';
type DiarySliceState = {
  selectedMonth: string;
  selectedWeek: string;
  selectedDay: string;
  calendarMode: CalendarMode;
};
type AppState = { diarySlice: DiarySliceState } & Record<string, unknown>;

const s = (st: AppState) => st.diarySlice;

export const selectSelectedMonthIso = (st: AppState): string => s(st).selectedMonth;
export const selectSelectedWeekIso = (st: AppState): string => s(st).selectedWeek;
export const selectSelectedDayIso = (st: AppState): string => s(st).selectedDay;
export const selectCalendarMode = (st: AppState): CalendarMode => s(st).calendarMode;

export const selectSelectedMonth = createSelector(
  [selectSelectedMonthIso],
  (iso): Dayjs => now(iso),
);

export const selectSelectedWeek = createSelector([selectSelectedWeekIso], (iso): Dayjs => now(iso));

type PeriodArg = { start: string; end: string };

const monthRange = (d: Dayjs): PeriodArg => ({
  start: d.startOf('month').format('YYYY-MM-DD'),
  end: d.endOf('month').format('YYYY-MM-DD'),
});

const weekRange = (d: Dayjs): PeriodArg => ({
  start: d.startOf('week').format('YYYY-MM-DD'),
  end: d.endOf('week').format('YYYY-MM-DD'),
});

const selectIsMonthMode = createSelector([selectCalendarMode], (mode): boolean => mode === 'month');

const selectPeriodArgs = createSelector(
  [selectSelectedMonthIso, selectIsMonthMode],
  (iso, isMonthMode): { prevArg: PeriodArg; currArg: PeriodArg; nextArg: PeriodArg } => {
    const selected = dayjs(iso);
    const unit: CalendarMode = isMonthMode ? 'month' : 'week';

    const prev = selected.add(-1, unit);
    const curr = selected;
    const next = selected.add(1, unit);

    const rangeFn = isMonthMode ? monthRange : weekRange;

    return {
      prevArg: rangeFn(prev),
      currArg: rangeFn(curr),
      nextArg: rangeFn(next),
    };
  },
);

const selectPrevQueryState = createSelector(
  [(state: AppState) => state, selectPeriodArgs],
  (state, { prevArg }) => diaryApi.endpoints.getDiariesByRange.select(prevArg)(state as any),
);

const selectCurrQueryState = createSelector(
  [(state: AppState) => state, selectPeriodArgs],
  (state, { currArg }) => diaryApi.endpoints.getDiariesByRange.select(currArg)(state as any),
);

const selectNextQueryState = createSelector(
  [(state: AppState) => state, selectPeriodArgs],
  (state, { nextArg }) => diaryApi.endpoints.getDiariesByRange.select(nextArg)(state as any),
);

export const selectIsDiaryPagingLoading = createSelector(
  [selectPrevQueryState, selectCurrQueryState, selectNextQueryState],
  (prevQuery, currQuery, nextQuery): boolean =>
    Boolean(prevQuery?.isLoading || currQuery?.isLoading || nextQuery?.isLoading),
);
