import { diaryApi } from '@entities/diary/api/diary.api';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  DiaryCalendarMode,
  type DiaryCalendarModeType,
  DiaryPageMode,
  type DiaryPageModeType,
} from '@/entities/calendar';
import type { Diary } from '@/entities/diary/model/diary.types';
import { formatWeekLabel, useAppDispatch, useAppSelector } from '@/shared';
import { getMonthRange } from '@/widgets/diary';

import { moveMonth, moveWeek, resetDiary } from '../../diary/model/diarySlice';
import { useDiaryMonthData, useDiaryWeekData } from '../hooks';
import { buildPages, type CalendarPage } from '../lib';
import {
  selectSelectedDayIso,
  selectSelectedMonth,
  selectSelectedMonthIso,
  selectSelectedWeek,
} from './selector';

const EMPTY: Diary[] = [];

/**
 * 주차 범위를 KST 기준 YYYY-MM-DD 문자열로 생성
 * startOf('week')는 프로젝트의 주 시작 요일 설정을 따름
 */
const weekRange = (weekStart: Dayjs) =>
  ({
    start: weekStart.startOf('week').format('YYYY-MM-DD'),
    end: weekStart.add(1, 'week').startOf('week').format('YYYY-MM-DD'),
  }) as const;

/**
 * Hook: 일기 페이저 뷰모델
 * 책임
 * 1) 월/주 윈도우(prev, curr, next) 계산
 * 2) 윈도우별 데이터 선택 및 페이지 모델 생성
 * 3) 네비게이션 핸들러와 모드 토글 제공
 * 성능 포인트
 * - 모드별로 필요한 값만 한 번 선택해서 downstream 의존성을 최소화
 * - buildPages는 선택된 기간에만 필터. 문자열 비교 사용으로 오버헤드 절감
 * - prefetch는 idle 시점에 실행해 dev 모드 이중 실행 영향 완화
 */
export const useDiaryPagerVM = () => {
  const dispatch = useAppDispatch();

  // 선택 상태
  const selectedMonthIso = useAppSelector(selectSelectedMonthIso);
  const selectedMonth = useAppSelector(selectSelectedMonth);
  const selectedWeek = useAppSelector(selectSelectedWeek);
  const selectedDayIso = useAppSelector(selectSelectedDayIso);

  // 화면 모드 상태
  const [diaryMode, setDiaryMode] = useState<DiaryPageModeType>(DiaryPageMode.calendarMode);
  const [calendarMode, setCalendarMode] = useState<DiaryCalendarModeType>(
    DiaryCalendarMode.monthDayMode,
  );

  const todayIso = useMemo(() => dayjs().format('YYYY-MM-DD'), []);
  const currentMonth = useMemo(() => dayjs(todayIso), [todayIso]);

  const isMonthMode = calendarMode === DiaryCalendarMode.monthDayMode;

  /**
   * 월 윈도우(prev, curr, next)와 그에 대응하는 range 파라미터
   * 의존성: selectedMonth
   */
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

  /**
   * 주 윈도우(prev, curr, next)와 그에 대응하는 range 파라미터
   * 의존성: selectedWeek
   */
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

  /**
   * 데이터 패칭
   * - 현재 월/주 데이터는 커스텀 훅으로 패칭
   * - 이전/다음 월/주는 RTK Query selector로 읽어 캐시를 활용
   * 주의: prevMonthSel?.data 같은 선택 결과는 메모로 감싸 참조 안정화
   */
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

  /**
   * 모드별로 필요한 윈도우와 데이터만 선택
   * 이 단계에서 한 번만 가지치기하여 불필요한 재계산을 줄임
   */
  const win = useMemo(
    () =>
      isMonthMode
        ? {
            prev: monthWin.prev,
            curr: monthWin.curr,
            next: monthWin.next,
            prevArg: monthWin.prevArg,
            currArg: monthWin.currArg,
            nextArg: monthWin.nextArg,
          }
        : {
            prev: weekWin.prev,
            curr: weekWin.curr,
            next: weekWin.next,
            prevArg: weekWin.prevArg,
            currArg: weekWin.currArg,
            nextArg: weekWin.nextArg,
          },
    [isMonthMode, monthWin, weekWin],
  );

  const dataTriplet = useMemo(
    () =>
      isMonthMode
        ? ([prevMonthData, monthData, nextMonthData] as const)
        : ([weekPrevData, weekCurrData, weekNextData] as const),
    [
      isMonthMode,
      prevMonthData,
      monthData,
      nextMonthData,
      weekPrevData,
      weekCurrData,
      weekNextData,
    ],
  );

  /**
   * 페이지 모델 생성
   * buildPages는 다음을 가정
   * - 선택된 날짜가 해당 기간에 속할 때만 필터
   * - recordDate와 selectedDayIso가 모두 YYYY-MM-DD이면 문자열 비교 사용
   */
  const pages: CalendarPage[] = useMemo(() => {
    const [prevData, currData, nextData] = dataTriplet;

    return buildPages({
      mode: isMonthMode ? 'month' : 'week',
      selectedDayIso,
      prevPeriod: win.prev,
      currPeriod: win.curr,
      nextPeriod: win.next,
      prevData,
      currData,
      nextData,
    });
  }, [isMonthMode, selectedDayIso, win.prev, win.curr, win.next, dataTriplet]);

  /**
   * 상단 라벨. 모드에 따라 월 또는 주 텍스트
   */
  const monthLabel = useMemo(
    () => (isMonthMode ? win.curr.format('M월') : formatWeekLabel(win.curr)),
    [isMonthMode, win.curr],
  );

  /**
   * 페이지 이동 핸들러
   * 모드별 액션을 분기하고, 의존성은 최소화
   */
  const goLeft = useCallback(() => {
    dispatch(isMonthMode ? moveMonth('left') : moveWeek('left'));
  }, [dispatch, isMonthMode]);

  const goRight = useCallback(() => {
    dispatch(isMonthMode ? moveMonth('right') : moveWeek('right'));
  }, [dispatch, isMonthMode]);

  /**
   * 모드 토글
   */
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

  /**
   * 리셋
   */
  const reset = useCallback(() => dispatch(resetDiary()), [dispatch]);

  /**
   * 인접 윈도우 prefetch
   * - dev 모드 이중 실행 시 체감 렉을 줄이기 위해 idle 시점으로 밀어 실행
   * - force: false로 캐시 활용
   */
  const prefetch = diaryApi.usePrefetch('getDiariesByRange');
  useEffect(() => {
    const run = () => {
      prefetch(win.prevArg, { force: false });
      prefetch(win.nextArg, { force: false });
    };

    // RN 환경에서 requestIdleCallback 존재 여부가 다를 수 있으므로 폴백 처리
    const ric = (global as unknown as { requestIdleCallback?: (fn: () => void) => number })
      .requestIdleCallback;
    const cic = (global as unknown as { cancelIdleCallback?: (id: number) => void })
      .cancelIdleCallback;

    let idleId: number | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (typeof ric === 'function') {
      idleId = ric(run);
    } else {
      timer = setTimeout(run, 0);
    }

    return () => {
      if (idleId !== null && typeof cic === 'function') {
        cic(idleId);
      }
      if (timer) clearTimeout(timer);
    };
  }, [prefetch, win.prevArg, win.nextArg]);

  return {
    // 상태 노출
    diaryMode,
    calendarMode,

    // 현재 선택된 월과 오늘
    selectedMonth: win.curr,
    currentMonth,

    // 파생 데이터
    selectedMonthIso,
    monthData,
    pages,
    monthLabel,

    // 인터랙션
    goLeft,
    goRight,
    toggleDiaryMode,
    toggleCalendarMode,
    reset,
  } as const;
};
