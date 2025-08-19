import { diaryApi } from '@entities/diary/api/diary.api';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  DiaryCalendarMode,
  DiaryCalendarModeType,
  DiaryPageMode,
  DiaryPageModeType,
} from '@/entities/calendar';
import type { Diary } from '@/entities/diary/model/diary.types';
import { formatWeekLabel, useAppDispatch, useAppSelector } from '@/shared';
import { getMonthRange } from '@/widgets/diary';

import { moveMonth, moveWeek, resetDiary } from '../../diary/model/diarySlice';
import { useDiaryMonthData, useDiaryWeekData } from '../hooks';
import { buildPages, CalendarPage } from '../lib';
import {
  selectSelectedDayIso,
  selectSelectedMonth,
  selectSelectedMonthIso,
  selectSelectedWeek,
} from './selector';

const EMPTY: Diary[] = [];

const weekRange = (weekStart: Dayjs) =>
  ({
    start: weekStart.startOf('week').format('YYYY-MM-DD'),
    end: weekStart.add(1, 'week').startOf('week').format('YYYY-MM-DD'),
  }) as const;

export const useDiaryPagerVM = () => {
  const dispatch = useAppDispatch();
  const selectedMonthIso = useAppSelector(selectSelectedMonthIso);
  const selectedMonth = useAppSelector(selectSelectedMonth);
  const selectedWeek = useAppSelector(selectSelectedWeek);
  const selectedDayIso = useAppSelector(selectSelectedDayIso);

  const [diaryMode, setDiaryMode] = useState<DiaryPageModeType>(DiaryPageMode.calendarMode);
  const [calendarMode, setCalendarMode] = useState<DiaryCalendarModeType>(
    DiaryCalendarMode.monthDayMode,
  );

  const currentMonth = dayjs();
  const isMonthMode = calendarMode === DiaryCalendarMode.monthDayMode;

  const monthWin = useMemo(() => {
    const prev = selectedMonth.add(-1, 'month');
    const curr = selectedMonth;
    const next = selectedMonth.add(1, 'month');
    return {
      prev,
      curr,
      next,
      prevArg: getMonthRange(prev),
      currArg: getMonthRange(curr),
      nextArg: getMonthRange(next),
    } as const;
  }, [selectedMonth]);

  const weekWin = useMemo(() => {
    const prev = selectedWeek.add(-1, 'week');
    const curr = selectedWeek;
    const next = selectedWeek.add(1, 'week');
    return {
      prev,
      curr,
      next,
      prevArg: weekRange(prev),
      currArg: weekRange(curr),
      nextArg: weekRange(next),
    } as const;
  }, [selectedWeek]);

  const { listData: monthData } = useDiaryMonthData(monthWin.curr);
  const prevMonthSel = useAppSelector(
    diaryApi.endpoints.getDiariesByRange.select(monthWin.prevArg),
  );
  const nextMonthSel = useAppSelector(
    diaryApi.endpoints.getDiariesByRange.select(monthWin.nextArg),
  );
  const prevMonthData = useMemo<Diary[]>(() => prevMonthSel?.data ?? EMPTY, [prevMonthSel?.data]);
  const nextMonthData = useMemo<Diary[]>(() => nextMonthSel?.data ?? EMPTY, [nextMonthSel?.data]);

  const { listData: weekCurrData } = useDiaryWeekData(weekWin.curr);
  const weekPrevSel = useAppSelector(diaryApi.endpoints.getDiariesByRange.select(weekWin.prevArg));
  const weekNextSel = useAppSelector(diaryApi.endpoints.getDiariesByRange.select(weekWin.nextArg));
  const weekPrevData = useMemo<Diary[]>(() => weekPrevSel?.data ?? EMPTY, [weekPrevSel?.data]);
  const weekNextData = useMemo<Diary[]>(() => weekNextSel?.data ?? EMPTY, [weekNextSel?.data]);

  const pages: CalendarPage[] = useMemo(() => {
    return buildPages({
      mode: isMonthMode ? 'month' : 'week',
      selectedDayIso,
      prevPeriod: isMonthMode ? monthWin.prev : weekWin.prev,
      currPeriod: isMonthMode ? monthWin.curr : weekWin.curr,
      nextPeriod: isMonthMode ? monthWin.next : weekWin.next,
      prevData: isMonthMode ? prevMonthData : weekPrevData,
      currData: isMonthMode ? monthData : weekCurrData,
      nextData: isMonthMode ? nextMonthData : weekNextData,
    });
  }, [
    isMonthMode,
    selectedDayIso,
    monthWin.prev,
    monthWin.curr,
    monthWin.next,
    weekWin.prev,
    weekWin.curr,
    weekWin.next,
    prevMonthData,
    monthData,
    nextMonthData,
    weekPrevData,
    weekCurrData,
    weekNextData,
  ]);

  const monthLabel = useMemo(
    () => (isMonthMode ? monthWin.curr.format('M월') : formatWeekLabel(weekWin.curr)),
    [isMonthMode, monthWin.curr, weekWin.curr],
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

  const prefetch = diaryApi.usePrefetch('getDiariesByRange');
  useEffect(() => {
    const args = isMonthMode
      ? [monthWin.prevArg, monthWin.nextArg]
      : [weekWin.prevArg, weekWin.nextArg];
    args.forEach(a => prefetch(a, { force: false }));
  }, [isMonthMode, monthWin.prevArg, monthWin.nextArg, weekWin.prevArg, weekWin.nextArg, prefetch]);

  return {
    diaryMode,
    calendarMode,
    selectedMonth: monthWin.curr,
    currentMonth,
    selectedMonthIso,
    monthData,
    pages,
    monthLabel,
    goLeft,
    goRight,
    toggleDiaryMode,
    toggleCalendarMode,
    reset,
  } as const;
};
