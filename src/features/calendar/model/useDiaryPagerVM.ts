import { DiaryCalendarMode, DiaryPageMode, type DiaryPageModeType } from '@entities/calendar';
import { formatWeekLabel, now, useAppDispatch, useAppSelector } from '@shared';
import { useCallback, useMemo, useState } from 'react';

import { moveMonth, moveWeek, resetDiary, setSelectedDay } from '../../diary';
import { buildPages, type CalendarPage } from '../lib';
import {
  selectCalendarMode,
  selectSelectedDayIso,
  selectSelectedMonth,
  selectSelectedWeek,
} from './selector';
import { useDiaryPagingData } from './useDiaryPagingData';

export const useDiaryPagerVM = () => {
  const dispatch = useAppDispatch();
  const selectedMonth = useAppSelector(selectSelectedMonth);
  const selectedWeek = useAppSelector(selectSelectedWeek);
  const calendarMode = useAppSelector(selectCalendarMode);
  const selectedDayIso = useAppSelector(selectSelectedDayIso);

  const [diaryMode, setDiaryMode] = useState<DiaryPageModeType>(DiaryPageMode.calendarMode);

  const isMonthMode = calendarMode === DiaryCalendarMode.monthDayMode;

  const { periods, datasets } = useDiaryPagingData({
    isMonthMode,
    selectedPeriod: isMonthMode ? selectedMonth : selectedWeek,
  });
  const pages: CalendarPage[] = useMemo(() => {
    return buildPages({
      mode: isMonthMode ? 'month' : 'week',
      selectedDayIso,
      prevPeriod: periods.prev,
      currPeriod: periods.curr,
      nextPeriod: periods.next,
      prevData: datasets.prevData,
      currData: datasets.currData,
      nextData: datasets.nextData,
    });
  }, [isMonthMode, selectedDayIso, periods, datasets]);

  const monthLabel = useMemo(
    () => (isMonthMode ? periods.curr.format('M월') : formatWeekLabel(periods.curr)),
    [isMonthMode, periods.curr],
  );

  const goLeft = useCallback(() => {
    dispatch(isMonthMode ? moveMonth('left') : moveWeek('left'));
  }, [dispatch, isMonthMode]);
  const goRight = useCallback(() => {
    dispatch(isMonthMode ? moveMonth('right') : moveWeek('right'));
  }, [dispatch, isMonthMode]);
  const toggleDiaryMode = useCallback(() => {
    setDiaryMode(p =>
      p === DiaryPageMode.listMode ? DiaryPageMode.calendarMode : DiaryPageMode.listMode,
    );
    dispatch(setSelectedDay(null));
  }, [dispatch]);
  const reset = useCallback(() => dispatch(resetDiary()), [dispatch]);

  return {
    diaryMode,
    selectedMonth: periods.curr,
    currentMonth: now(),
    monthData: datasets.currData,
    pages,
    monthLabel,
    goLeft,
    goRight,
    toggleDiaryMode,
    reset,
  } as const;
};
