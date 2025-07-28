import { Dayjs } from 'dayjs';
import { FlatList, StyleSheet, View } from 'react-native';
import SelectableDayCell from './SelectableDayCell';

interface CalendarBarProps {
  monthlyDates: (Dayjs | null)[][];
}

const CalendarBar = ({ monthlyDates }: CalendarBarProps) => {
  const days = monthlyDates.flat();

  return (
    <FlatList
      data={days}
      numColumns={7}
      keyExtractor={(_, idx) => String(idx)}
      contentContainerStyle={styles.container}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.cell}>
          {item ? <SelectableDayCell date={item} /> : <View style={styles.cell} />}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    height: 55,
    justifyContent: 'center',
    marginBottom: 8,
    width: '14.2857%',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default CalendarBar;
