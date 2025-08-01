import { EmotionDiaryDTO } from '@entities/diary';
import { useSelectByDayQuery, useSelectByMonthQuery } from '@shared/api/diary/diaryApi';
import useDelay from '@shared/hooks/useDelay';
import { Dayjs } from 'dayjs';
import { useMemo } from 'react';

export const getMonthRange = (date: Dayjs) => ({
  start: date.startOf('month').toISOString(),
  end: date.add(1, 'month').startOf('month').toISOString(),
});

export function useDiaryMonthData(monthDate: Dayjs) {
  const range = useMemo(() => getMonthRange(monthDate), [monthDate]);
  const { data, isFetching } = useSelectByMonthQuery(range);
  const showSkeleton = useDelay(isFetching);
  const listData = useMemo((): EmotionDiaryDTO[] => data ?? [], [data]);
  return { listData, showSkeleton } as const;
}

export function useDiaryDayData(dayIso: string, enabled: boolean) {
  const { data, isFetching } = useSelectByDayQuery(dayIso, { skip: !enabled });
  const listData = useMemo(() => (enabled && data ? [data] : []), [enabled, data]);
  const showSkeleton = useDelay(isFetching);
  return { listData, showSkeleton } as const;
}
