import { diaryApi } from '@entities/diary/api/diary.api';
import type { Diary } from '@entities/diary/model/diary.types';
import { getMonthRange } from '@widgets/diary';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';

const EMPTY_ARRAY: Diary[] = [];

const weekRange = (weekStart: Dayjs) => ({
  start: weekStart.startOf('week').format('YYYY-MM-DD'),
  end: weekStart.endOf('week').format('YYYY-MM-DD'),
});
interface UseDiaryPagingDataProps {
  isMonthMode: boolean;
  selectedPeriod: Dayjs;
}

export const useDiaryPagingData = ({ isMonthMode, selectedPeriod }: UseDiaryPagingDataProps) => {
  const periodType = isMonthMode ? 'month' : 'week';

  // ✅ 현재 모드에 따라 필요한 기간만 계산합니다.
  const { prev, curr, next } = useMemo(
    () => ({
      prev: selectedPeriod.add(-1, periodType),
      curr: selectedPeriod,
      next: selectedPeriod.add(1, periodType),
    }),
    [selectedPeriod, periodType],
  );

  const rangeFn = isMonthMode ? getMonthRange : weekRange;

  const { data: prevData, isSuccess: prevSuccess } = diaryApi.useGetDiariesByRangeQuery(
    rangeFn(prev),
  );
  const { data: currData, isSuccess: currSuccess } = diaryApi.useGetDiariesByRangeQuery(
    rangeFn(curr),
  );
  const { data: nextData, isSuccess: nextSuccess } = diaryApi.useGetDiariesByRangeQuery(
    rangeFn(next),
  );

  const prefetch = diaryApi.usePrefetch('getDiariesByRange');
  useMemo(() => {
    prefetch(rangeFn(prev.add(-1, periodType)));
    prefetch(rangeFn(next.add(1, periodType)));
  }, [prefetch, prev, next, rangeFn, periodType]);

  return useMemo(
    () => ({
      periods: { prev, curr, next },
      datasets: {
        prevData: prevSuccess ? prevData : EMPTY_ARRAY,
        currData: currSuccess ? currData : EMPTY_ARRAY,
        nextData: nextSuccess ? nextData : EMPTY_ARRAY,
      },
    }),
    [prev, curr, next, prevSuccess, prevData, currSuccess, currData, nextSuccess, nextData],
  );
};
