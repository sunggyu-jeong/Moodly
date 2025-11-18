import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import EmotionDiaryEmptyMessage from './EmotionDiaryEmptyMessage';

const EmotionDiaryListEmpty = () => (
  <View style={styles.emptyContainer}>
    <EmotionDiaryEmptyMessage />
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default memo(EmotionDiaryListEmpty);
