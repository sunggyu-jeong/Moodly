import { createSelector } from '@reduxjs/toolkit';
import dayjs, { Dayjs } from 'dayjs';

import type { RootState } from '@/app/store';
import { diaryApi } from '@/entities/diary/api';
import { getMonthRange } from '@/shared/lib/date.util';
import { now } from '@/shared/lib/day.util';

const s = (st: RootState) => st.diarySlice;

export const selectSelectedMonthIso = (st: RootState) => s(st).selectedMonth;
export const selectSelectedWeekIso = (st: RootState) => s(st).selectedWeek;
export const selectSelectedDayIso = (st: RootState) => s(st).selectedDay;
export const selectCalendarMode = (st: RootState) => s(st).calendarMode;

export const selectSelectedMonth = createSelector([selectSelectedMonthIso], iso => now(iso));

export const selectSelectedWeek = createSelector([selectSelectedWeekIso], iso => now(iso));

const weekRange = (weekStart: Dayjs) => ({
  start: weekStart.startOf('week').format('YYYY-MM-DD'),
  end: weekStart.endOf('week').format('YYYY-MM-DD'),
});

const selectIsMonthMode = createSelector([s], slice => slice.calendarMode);

const selectPeriodArgs = createSelector(
  [selectSelectedMonthIso, selectIsMonthMode],
  (iso, isMonthMode) => {
    const periodType = isMonthMode ? 'month' : 'week';
    const selectedPeriod = dayjs(iso);

    const prev = selectedPeriod.add(-1, periodType);
    const curr = selectedPeriod;
    const next = selectedPeriod.add(1, periodType);

    const rangeFn = isMonthMode ? getMonthRange : weekRange;

    return {
      prevArg: rangeFn(prev),
      currArg: rangeFn(curr),
      nextArg: rangeFn(next),
    };
  },
);

const selectPrevQueryState = createSelector(
  [(state: RootState) => state, selectPeriodArgs],
  (state, { prevArg }) => diaryApi.endpoints.getDiariesByRange.select(prevArg)(state),
);
const selectCurrQueryState = createSelector(
  [(state: RootState) => state, selectPeriodArgs],
  (state, { currArg }) => diaryApi.endpoints.getDiariesByRange.select(currArg)(state),
);
const selectNextQueryState = createSelector(
  [(state: RootState) => state, selectPeriodArgs],
  (state, { nextArg }) => diaryApi.endpoints.getDiariesByRange.select(nextArg)(state),
);

export const selectIsDiaryPagingLoading = createSelector(
  [selectPrevQueryState, selectCurrQueryState, selectNextQueryState],
  (prevQuery, currQuery, nextQuery) => {
    // return false;
    return prevQuery?.isLoading || currQuery?.isLoading || nextQuery?.isLoading;
  },
);
