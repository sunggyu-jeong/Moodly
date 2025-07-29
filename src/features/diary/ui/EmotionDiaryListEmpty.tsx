import React from 'react';
import { StyleSheet, View } from 'react-native';
import EmotionDiaryEmptyMessage from './EmotionDiaryEmptyMessage';

interface DiaryListEmptyProps {
  showSkeleton: boolean;
}
const EmotionDiaryListEmpty = ({ showSkeleton }: DiaryListEmptyProps) =>
  !showSkeleton ? (
    <View style={styles.emptyContainer}>
      <EmotionDiaryEmptyMessage />
    </View>
  ) : null;

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 20,
  },
});

export default React.memo(EmotionDiaryListEmpty);
