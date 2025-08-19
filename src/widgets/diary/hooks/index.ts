import { useGetDiariesByRangeQuery } from '@entities/diary/api/diary.api';
import type { Diary } from '@entities/diary/model/diary.types';
import useDelay from '@shared/hooks/useDelay';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';

export const getMonthRange = (date: Dayjs) => ({
  start: date.startOf('month').format('YYYY-MM-DD'),
  end: date.add(1, 'month').startOf('month').format('YYYY-MM-DD'),
});

export function useDiaryMonthData(monthDate: Dayjs) {
  const range = useMemo(() => getMonthRange(monthDate), [monthDate]);
  const { data, isFetching } = useGetDiariesByRangeQuery(range, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    selectFromResult: r => ({ data: r.data, isFetching: r.isFetching }),
  });
  const showSkeleton = useDelay(isFetching);
  const listData = useMemo((): Diary[] => data ?? [], [data]);
  return { listData, showSkeleton } as const;
}

export function useDiaryWeekData(weekStart: Dayjs) {
  const [start, end] = useMemo(() => {
    const start = weekStart.startOf('week').format('YYYY-MM-DD');
    const end = weekStart.add(1, 'week').startOf('week').format('YYYY-MM-DD');
    return [start, end] as const;
  }, [weekStart]);

  const { data, isFetching } = useGetDiariesByRangeQuery(
    { start, end },
    {
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
      selectFromResult: r => ({ data: r.data, isFetching: r.isFetching }),
    },
  );
  const showSkeleton = useDelay(isFetching);
  const listData = useMemo<Diary[]>(() => data ?? [], [data]);

  return { listData, showSkeleton } as const;
}
