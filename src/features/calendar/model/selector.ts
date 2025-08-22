import type { RootState } from '@app/store';
import { createSelector } from '@reduxjs/toolkit';
import { createKstDay } from '@shared';
import dayjs from 'dayjs';

const s = (st: RootState) => st.diarySlice;

export const selectSelectedMonthIso = (st: RootState) => s(st).selectedMonth;
export const selectSelectedWeekIso = (st: RootState) => s(st).selectedWeek;
export const selectSelectedDayIso = (st: RootState) => s(st).selectedDay;

export const selectSelectedMonth = createSelector([selectSelectedMonthIso], iso =>
  createKstDay(iso),
);

export const selectSelectedWeek = createSelector([selectSelectedWeekIso], iso => dayjs(iso));
