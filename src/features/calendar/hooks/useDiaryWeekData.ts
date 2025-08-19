import { useGetDiariesByRangeQuery } from '@entities/diary/api';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';

export const useDiaryWeekData = (weekStart: Dayjs) => {
  const start = weekStart.startOf('week').toString();
  const end = weekStart.endOf('week').toString();

  const { data, isFetching } = useGetDiariesByRangeQuery(
    { start, end },
    {
      refetchOnFocus: false,
      refetchOnReconnect: false,
      selectFromResult: ({ data, isFetching }) => ({
        data,
        isFetching,
        listData: data ?? [],
      }),
    },
  );

  return useMemo(
    () => ({
      listData: data ?? [],
      showSkeleton: isFetching,
    }),
    [data, isFetching],
  );
};
