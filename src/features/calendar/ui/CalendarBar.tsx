import { Diary } from '@entities/diary/model/diary.types';
import { GridList } from '@shared/ui/elements/GridList';
import dayjs, { Dayjs } from 'dayjs';
import { memo, useMemo } from 'react';
import { View } from 'react-native';

import SelectableDayCell from './SelectableDayCell';

interface CalendarBarProps {
  monthlyDates: (Dayjs | null)[][];
  entries: Diary[] | undefined;
}

const CalendarBar = ({ monthlyDates, entries }: CalendarBarProps) => {
  const entryMap = useMemo(() => {
    const m = new Map<string, number>();
    entries?.forEach(e => {
      m.set(dayjs(e.recordDate).format('YYYY-MM-DD'), e.iconId ?? -1);
    });
    return m;
  }, [entries]);

  const flatDates = useMemo(() => monthlyDates.flat(), [monthlyDates]);

  const gridData = useMemo(
    () =>
      flatDates.map(date => ({
        date,
        iconId: date ? (entryMap.get(date.format('YYYY-MM-DD')) ?? null) : null,
      })),
    [flatDates, entryMap],
  );
  return (
    <GridList<{ date: Dayjs | null; iconId: number | null }>
      data={gridData}
      keyExtractor={(item, idx) => (item.date ? item.date.format('YYYY-MM-DD') : `empty-${idx}`)}
      renderItem={({ date, iconId }) =>
        date ? (
          <SelectableDayCell
            date={date}
            iconId={iconId}
          />
        ) : (
          <View />
        )
      }
    />
  );
};

export default memo(CalendarBar);
