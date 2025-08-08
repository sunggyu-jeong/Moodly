import { useSelectByMonthQuery } from '@shared/api/diary/diaryApi';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';

export const useDiaryMonthData = (month: Dayjs) => {
  const start = month.startOf('month').toISOString();
  const end = month.endOf('month').toISOString();

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
    }
  );

  return useMemo(
    () => ({
      listData: data ?? [],
      showSkeleton: isFetching,
    }),
    [data, isFetching]
  );
};
