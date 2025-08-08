import {
  DiaryCalendarMode,
  DiaryCalendarModeType,
  DiaryPageMode,
  DiaryPageModeType,
} from '@entities/calendar/diary.type';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { formatWeekLabel } from '@shared/lib/date.util';
import { useDiaryMonthData, useDiaryWeekData } from '@widgets/diary/hooks';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { moveMonth, moveWeek, resetDiary } from '../../diary/model/diary.slice';
import { buildPages, CalendarPage } from '../lib/paging';
import {
  selectSelectedDayIso,
  selectSelectedMonth,
  selectSelectedMonthIso,
  selectSelectedWeek,
} from './selector';

export const useDiaryPagerVM = () => {
  const dispatch = useAppDispatch();
  const selectedMonthIso = useAppSelector(selectSelectedMonthIso);
  const selectedMonth = useAppSelector(selectSelectedMonth);
  const selectedWeek = useAppSelector(selectSelectedWeek);
  const selectedDayIso = useAppSelector(selectSelectedDayIso);

  const [diaryMode, setDiaryMode] = useState<DiaryPageModeType>(DiaryPageMode.calendarMode);
  const [calendarMode, setCalendarMode] = useState<DiaryCalendarModeType>(
    DiaryCalendarMode.monthDayMode
  );

  const currentMonth = dayjs();
  const prevMonth = selectedMonth.add(-1, 'month');
  const nextMonth = selectedMonth.add(1, 'month');

  const weekStarts = useMemo<[Dayjs, Dayjs, Dayjs]>(
    () => [selectedWeek.add(-1, 'week'), selectedWeek, selectedWeek.add(1, 'week')],
    [selectedWeek]
  );

  const { listData: prevMonthData } = useDiaryMonthData(prevMonth);
  const { listData: monthData } = useDiaryMonthData(selectedMonth);
  const { listData: nextMonthData } = useDiaryMonthData(nextMonth);

  const { listData: weekPrevData } = useDiaryWeekData(weekStarts[0]);
  const { listData: weekCurrData } = useDiaryWeekData(weekStarts[1]);
  const { listData: weekNextData } = useDiaryWeekData(weekStarts[2]);

  const pages: CalendarPage[] = useMemo(() => {
    const isMonth = calendarMode === DiaryCalendarMode.monthDayMode;

    return buildPages({
      mode: isMonth ? 'month' : 'week',
      selectedDayIso,
      prevPeriod: isMonth ? prevMonth : weekStarts[0],
      currPeriod: isMonth ? selectedMonth : weekStarts[1],
      nextPeriod: isMonth ? nextMonth : weekStarts[2],
      prevData: isMonth ? prevMonthData : weekPrevData,
      currData: isMonth ? monthData : weekCurrData,
      nextData: isMonth ? nextMonthData : weekNextData,
    });
  }, [
    calendarMode,
    selectedDayIso,
    prevMonth,
    selectedMonth,
    nextMonth,
    weekStarts,
    prevMonthData,
    monthData,
    nextMonthData,
    weekPrevData,
    weekCurrData,
    weekNextData,
  ]);

  const monthLabel = useMemo(() => {
    return calendarMode === DiaryCalendarMode.monthDayMode
      ? selectedMonth.format('M월')
      : formatWeekLabel(weekStarts[1]);
  }, [calendarMode, selectedMonth, weekStarts]);

  const goLeft = useCallback(() => {
    if (calendarMode === DiaryCalendarMode.monthDayMode) {
      dispatch(moveMonth('left'));
    } else {
      dispatch(moveWeek('left'));
    }
  }, [dispatch, calendarMode]);

  const goRight = useCallback(() => {
    if (calendarMode === DiaryCalendarMode.monthDayMode) {
      dispatch(moveMonth('right'));
    } else {
      dispatch(moveWeek('right'));
    }
  }, [dispatch, calendarMode]);

  const toggleDiaryMode = useCallback(() => {
    setDiaryMode(p =>
      p === DiaryPageMode.listMode ? DiaryPageMode.calendarMode : DiaryPageMode.listMode
    );
  }, []);
  const toggleCalendarMode = useCallback(() => {
    setCalendarMode(c =>
      c === DiaryCalendarMode.monthDayMode
        ? DiaryCalendarMode.weekDayMode
        : DiaryCalendarMode.monthDayMode
    );
  }, []);

  const reset = useCallback(() => dispatch(resetDiary()), [dispatch]);

  return {
    diaryMode,
    calendarMode,
    selectedMonth,
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
  };
};
