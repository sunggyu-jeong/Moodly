import { DiaryPageModeType } from '@entities/calendar/diary.type';
import { EmotionDiaryDTO } from '@entities/diary';
import EmotionDiaryCardList from '@features/diary/ui/EmotionDiaryCardList';
import EmotionDiaryListEmpty from '@features/diary/ui/EmotionDiaryListEmpty';
import EmotionDiaryListHeader from '@features/diary/ui/EmotionDiaryListHeader';
import { isEmpty } from '@shared/lib';
import colors from '@shared/styles/colors';
import { Dayjs } from 'dayjs';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

interface EmotionDiaryMonthViewProps {
  monthDate: Dayjs;
  listData: EmotionDiaryDTO[]; // EmotionDiaryDTO[]
  monthData: EmotionDiaryDTO[]; // Month summary DTO
  diaryMode: DiaryPageModeType;
  currentMonth: Dayjs;
  selectedMonth: Dayjs;
  scrollEnabled: boolean;
}

const EmotionDiaryMonthView = ({
  monthDate,
  listData,
  monthData,
  diaryMode,
  scrollEnabled,
}: EmotionDiaryMonthViewProps) => (
  <View style={styles.page}>
    <FlatList
      style={styles.list}
      data={listData}
      keyExtractor={(item, idx) => item.emotionId?.toString() ?? idx.toString()}
      contentContainerStyle={[styles.scrollViewContent, isEmpty(listData) && styles.emptyContainer]}
      ListHeaderComponent={
        <EmotionDiaryListHeader
          showSkeleton={false}
          diaryMode={diaryMode}
          selectedMonth={monthDate.toISOString()}
          monthData={monthData}
        />
      }
      ListEmptyComponent={<EmotionDiaryListEmpty showSkeleton={false} />}
      renderItem={({ item }) => <EmotionDiaryCardList data={item} />}
      scrollEnabled={scrollEnabled}
    />
  </View>
);

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  page: {
    backgroundColor: colors.gray[100],
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
});

export default React.memo(EmotionDiaryMonthView);
