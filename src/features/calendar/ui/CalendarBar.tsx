import { EmotionDiaryDTO } from '@/entities/diary';
import { GridList } from '@shared/ui/elements/GridList';
import dayjs, { Dayjs } from 'dayjs';
import { View } from 'react-native';
import SelectableDayCell from './SelectableDayCell';

interface CalendarBarProps {
  monthlyDates: (Dayjs | null)[][];
  entries: EmotionDiaryDTO[] | undefined;
}

const CalendarBar = ({ monthlyDates, entries }: CalendarBarProps) => {
  const flatDates = monthlyDates.flat();

  return (
    <GridList<{ date: Dayjs | null; iconId: number | null }>
      data={flatDates.map(date => {
        if (!date) return { date: null, iconId: null };
        const hit = entries?.find(e => dayjs(e.recordDate).isSame(date, 'day'));
        return { date, iconId: hit?.iconId ?? null };
      })}
      renderItem={({ date, iconId }, idx) =>
        date ? (
          <SelectableDayCell
            date={date}
            iconId={iconId}
            key={idx}
          />
        ) : (
          <View key={idx} />
        )
      }
    />
  );
};

export default CalendarBar;
