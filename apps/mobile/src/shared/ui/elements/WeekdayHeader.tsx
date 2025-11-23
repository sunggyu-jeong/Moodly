import { StyleSheet } from 'react-native';

import { Caption } from '../typography/Caption';
import { GridList } from './GridList';

const WeekdayHeader = () => {
  const labels = ['일', '월', '화', '수', '목', '금', '토'];
  return (
    <GridList
      data={labels}
      renderItem={item => <Caption weight="semibold">{item}</Caption>}
      cellStyle={styles.cell}
    />
  );
};

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    height: 15,
    justifyContent: 'center',
    marginBottom: 8,
    width: `${100 / 7}%`,
  },
});

export default WeekdayHeader;
