import { useSelectByMonthQuery } from '@shared/api/diary/diaryApi';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';

export const useDiaryWeekData = (weekStart: Dayjs) => {
  const start = weekStart.startOf('week').toISOString();
  const end = weekStart.endOf('week').toISOString();

  const { data, isFetching } = useSelectByMonthQuery(
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
