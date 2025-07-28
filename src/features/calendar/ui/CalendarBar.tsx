import { GridList } from '@shared/ui/elements/GridList';
import { Dayjs } from 'dayjs';
import { View } from 'react-native';
import SelectableDayCell from './SelectableDayCell';

interface CalendarBarProps {
  monthlyDates: (Dayjs | null)[][];
}

const CalendarBar = ({ monthlyDates }: CalendarBarProps) => {
  const days = monthlyDates.flat();

  return (
    <GridList
      data={days}
      renderItem={item => (item ? <SelectableDayCell date={item} /> : <View />)}
    />
  );
};

export default CalendarBar;
