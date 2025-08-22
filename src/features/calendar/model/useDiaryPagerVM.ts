import {
  DiaryCalendarMode,
  type DiaryCalendarModeType,
  DiaryPageMode,
  type DiaryPageModeType,
} from '@entities/calendar';
import { formatWeekLabel, useAppDispatch, useAppSelector } from '@shared';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';

import { moveMonth, moveWeek, resetDiary } from '../../diary';
import { buildPages, type CalendarPage } from '../lib';
import { selectSelectedDayIso, selectSelectedMonth, selectSelectedWeek } from './selector';
import { useDiaryPagingData } from './useDiaryPagingData';

export const useDiaryPagerVM = () => {
  const dispatch = useAppDispatch();
  const selectedMonth = useAppSelector(selectSelectedMonth);
  const selectedWeek = useAppSelector(selectSelectedWeek);
  const selectedDayIso = useAppSelector(selectSelectedDayIso);

  const [diaryMode, setDiaryMode] = useState<DiaryPageModeType>(DiaryPageMode.calendarMode);
  const [calendarMode, setCalendarMode] = useState<DiaryCalendarModeType>(
    DiaryCalendarMode.monthDayMode,
  );
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
  }, []);
  const toggleCalendarMode = useCallback(() => {
    setCalendarMode(c =>
      c === DiaryCalendarMode.monthDayMode
        ? DiaryCalendarMode.weekDayMode
        : DiaryCalendarMode.monthDayMode,
    );
  }, []);
  const reset = useCallback(() => dispatch(resetDiary()), [dispatch]);

  return {
    diaryMode,
    calendarMode,
    selectedMonth: periods.curr,
    currentMonth: dayjs(),
    monthData: datasets.currData,
    pages,
    monthLabel,
    goLeft,
    goRight,
    toggleDiaryMode,
    toggleCalendarMode,
    reset,
  } as const;
};
