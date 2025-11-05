import dayjs, { Dayjs } from 'dayjs';
import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';

import type { Diary } from '@/entities/diary/model/diary.types';
import { setCurrentDiary, setSelectedDay } from '@/features/diary/model/diarySlice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useHooks';
import { formatDate, now } from '@/shared/lib/day.util';
import { navigate } from '@/shared/lib/navigation.util';
import { isEmpty } from '@/shared/lib/value.util';
import { GridList } from '@/shared/ui/elements/GridList';

import SelectableDayCell from './SelectableDayCell';

interface CalendarBarProps {
  monthlyDates: (Dayjs | null)[][];
  entries: Diary[] | undefined;
}

const CalendarBar = ({ monthlyDates, entries }: CalendarBarProps) => {
  const selectedDayStr = useAppSelector(state => state.diarySlice.selectedDay);
  const selectedDay = useMemo(() => {
    if (isEmpty(selectedDayStr)) {
      return null;
    }
    return now(selectedDayStr);
  }, [selectedDayStr]);
  const dispatch = useAppDispatch();

  const entryMap = useMemo(() => {
    const m = new Map<string, number>();
    entries?.forEach(e => {
      m.set(formatDate(dayjs(e.recordDate)), e.iconId ?? -1);
    });
    return m;
  }, [entries]);

  const flatDates = useMemo(() => monthlyDates.flat(), [monthlyDates]);

  const gridData = useMemo(
    () =>
      flatDates.map(date => ({
        date,
        iconId: date ? (entryMap.get(formatDate(date)) ?? null) : null,
      })),
    [flatDates, entryMap],
  );

  const handleSelectDay = useCallback(
    (date: Dayjs) => {
      dispatch(setSelectedDay(formatDate(date)));
    },
    [dispatch],
  );

  const handleStartEmotionSelection = useCallback(
    (date: Dayjs) => {
      const emotion: Partial<Diary> = { recordDate: formatDate(date) };
      dispatch(setCurrentDiary(emotion));
      navigate('DiaryStack', { screen: 'EmotionSelectionPage' });
    },
    [dispatch],
  );
  return (
    <GridList<{ date: Dayjs | null; iconId: number | null }>
      data={gridData}
      keyExtractor={(item, idx) => (item.date ? item.date.format('YYYY-MM-DD') : `empty-${idx}`)}
      renderItem={item => {
        if (!item.date) return <View />;

        const isSelected = item.date.isSame(selectedDay, 'day');
        return (
          <SelectableDayCell
            date={item.date}
            iconId={item.iconId}
            isSelected={isSelected}
            onSelectDay={handleSelectDay}
            onStartEmotionSelection={handleStartEmotionSelection}
          />
        );
      }}
    />
  );
};

export default memo(CalendarBar);
