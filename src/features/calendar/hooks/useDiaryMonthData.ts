import { useGetDiariesByRangeQuery } from '@/entities/diary/api';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';

export const useDiaryMonthData = (month: Dayjs) => {
  const start = month.startOf('month').toString();
  const end = month.endOf('month').toString();

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
