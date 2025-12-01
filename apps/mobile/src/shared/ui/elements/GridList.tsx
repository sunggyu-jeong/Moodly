import { ReactNode } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

interface GridListProps<T> {
  data: T[];
  numColumns?: number;
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  containerStyle?: object;
  cellStyle?: object;
}

export function GridList<T>({
  data,
  numColumns = 7,
  renderItem,
  keyExtractor = (_, idx) => String(idx),
  containerStyle,
  cellStyle,
}: GridListProps<T>) {
  return (
    <FlatList
      data={data}
      initialNumToRender={7}
      windowSize={3}
      numColumns={numColumns}
      keyExtractor={keyExtractor}
      scrollEnabled={false}
      columnWrapperStyle={styles.columnWrapperStyle}
      contentContainerStyle={[styles.container, containerStyle]}
      renderItem={({ item, index }) => (
        <View style={[styles.cell, cellStyle]}>{renderItem(item, index)}</View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    height: 55,
    justifyContent: 'center',
    marginBottom: 8,
    width: `${100 / 7}%`,
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 45,
  },
});
