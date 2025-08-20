import {
  DiaryCalendarMode,
  type DiaryCalendarModeType,
  DiaryPageMode,
  type DiaryPageModeType,
} from '@entities/calendar';
import { diaryApi } from '@entities/diary/api/diary.api';
import type { Diary } from '@entities/diary/model/diary.types';
import { formatWeekLabel, useAppDispatch, useAppSelector } from '@shared';
import { getMonthRange } from '@widgets/diary';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { moveMonth, moveWeek, resetDiary } from '../../diary';
import { buildPages, type CalendarPage } from '../lib';
import { selectSelectedDayIso, selectSelectedMonth, selectSelectedWeek } from './selector';

const EMPTY_ARRAY: Diary[] = [];

const weekRange = (weekStart: Dayjs) =>
  ({
    start: weekStart.startOf('week').format('YYYY-MM-DD'),
    end: weekStart.add(1, 'week').startOf('week').format('YYYY-MM-DD'),
  }) as const;

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
    };
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
    };
  }, [selectedWeek]);

  const { data: prevMonthData, isSuccess: prevMonthSuccess } = diaryApi.useGetDiariesByRangeQuery(
    monthWin.prevArg,
  );
  const { data: monthData, isSuccess: monthSuccess } = diaryApi.useGetDiariesByRangeQuery(
    monthWin.currArg,
  );
  const { data: nextMonthData, isSuccess: nextMonthSuccess } = diaryApi.useGetDiariesByRangeQuery(
    monthWin.nextArg,
  );

  const { data: weekPrevData, isSuccess: weekPrevSuccess } = diaryApi.useGetDiariesByRangeQuery(
    weekWin.prevArg,
  );
  const { data: weekCurrData, isSuccess: weekCurrSuccess } = diaryApi.useGetDiariesByRangeQuery(
    weekWin.currArg,
  );
  const { data: weekNextData, isSuccess: weekNextSuccess } = diaryApi.useGetDiariesByRangeQuery(
    weekWin.nextArg,
  );

  const finalPrevMonthData = prevMonthSuccess ? prevMonthData : EMPTY_ARRAY;
  const finalMonthData = monthSuccess ? monthData : EMPTY_ARRAY;
  const finalNextMonthData = nextMonthSuccess ? nextMonthData : EMPTY_ARRAY;

  const finalWeekPrevData = weekPrevSuccess ? weekPrevData : EMPTY_ARRAY;
  const finalWeekCurrData = weekCurrSuccess ? weekCurrData : EMPTY_ARRAY;
  const finalWeekNextData = weekNextSuccess ? weekNextData : EMPTY_ARRAY;

  const pages: CalendarPage[] = useMemo(() => {
    return buildPages({
      mode: isMonthMode ? 'month' : 'week',
      selectedDayIso,
      prevPeriod: monthWin.prev,
      currPeriod: monthWin.curr,
      nextPeriod: monthWin.next,
      // 안정화된 데이터를 pages 생성에 사용합니다.
      prevData: isMonthMode ? finalPrevMonthData : finalWeekPrevData,
      currData: isMonthMode ? finalMonthData : finalWeekCurrData,
      nextData: isMonthMode ? finalNextMonthData : finalWeekNextData,
    });
  }, [
    isMonthMode,
    selectedDayIso,
    monthWin.prev,
    monthWin.curr,
    monthWin.next,
    finalPrevMonthData,
    finalMonthData,
    finalNextMonthData,
    finalWeekPrevData,
    finalWeekCurrData,
    finalWeekNextData,
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
    args.forEach(a => prefetch(a));
  }, [isMonthMode, monthWin.prevArg, monthWin.nextArg, weekWin.prevArg, weekWin.nextArg, prefetch]);

  return {
    diaryMode,
    calendarMode,
    selectedMonth: monthWin.curr,
    currentMonth: dayjs(),
    selectedMonthIso: selectedMonth.format('YYYY-MM'),
    monthData: finalMonthData, // 최종 데이터를 반환
    pages,
    monthLabel,
    goLeft,
    goRight,
    toggleDiaryMode,
    toggleCalendarMode,
    reset,
  } as const;
};
