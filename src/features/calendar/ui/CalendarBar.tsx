import type { Diary } from '@entities/diary/model/diary.types';
import { navigate, toKstDate, useAppDispatch, useAppSelector } from '@shared';
import { GridList } from '@shared/ui/elements/GridList';
import dayjs, { Dayjs } from 'dayjs';
import { memo, useCallback, useMemo } from 'react';
import { View } from 'react-native';

import { setCurrentDiary, setSelectedDay } from '../../diary';
import SelectableDayCell from './SelectableDayCell';

interface CalendarBarProps {
  monthlyDates: (Dayjs | null)[][];
  entries: Diary[] | undefined;
}

const CalendarBar = ({ monthlyDates, entries }: CalendarBarProps) => {
  const selectedDayStr = useAppSelector(state => state.diarySlice.selectedDay);
  const selectedDay = useMemo(() => dayjs(selectedDayStr), [selectedDayStr]);
  const dispatch = useAppDispatch();

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

  const handleSelectDay = useCallback(
    (date: Dayjs) => {
      dispatch(setSelectedDay(toKstDate(date)));
    },
    [dispatch],
  );

  const handleStartEmotionSelection = useCallback(
    (date: Dayjs) => {
      const emotion: Partial<Diary> = { recordDate: toKstDate(date) };
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

        const iconId = entryMap.get(item.date.format('YYYY-MM-DD')) ?? null;
        const isSelected = item.date.isSame(selectedDay, 'day');

        return (
          <SelectableDayCell
            date={item.date}
            iconId={iconId}
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
