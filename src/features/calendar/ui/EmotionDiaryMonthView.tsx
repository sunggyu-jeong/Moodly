import { DiaryCalendarModeType, DiaryPageModeType } from '@entities/calendar/diary.type';
import { EmotionDiaryDTO } from '@entities/diary';
import EmotionDiaryCardList from '@features/diary/ui/EmotionDiaryCardList';
import EmotionDiaryListEmpty from '@features/diary/ui/EmotionDiaryListEmpty';
import EmotionDiaryListHeader from '@features/diary/ui/EmotionDiaryListHeader';
import { isEmpty } from '@shared/lib';
import colors from '@shared/styles/colors';
import { Dayjs } from 'dayjs';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

interface EmotionDiaryMonthViewProps {
  monthDate: Dayjs;
  listData: EmotionDiaryDTO[]; // EmotionDiaryDTO[]
  monthData: EmotionDiaryDTO[]; // Month summary DTO
  diaryMode: DiaryPageModeType;
  currentMonth: Dayjs;
  selectedMonth: Dayjs;
  scrollEnabled: boolean;
  showSkeleton?: boolean;
  calendarMode?: DiaryCalendarModeType;
}

const EmotionDiaryMonthView = ({
  monthDate,
  listData,
  monthData,
  diaryMode,
  scrollEnabled,
  showSkeleton,
  calendarMode,
}: EmotionDiaryMonthViewProps) => {
  const renderDiaryCard = useCallback(
    ({ item }: { item: EmotionDiaryDTO }) => <EmotionDiaryCardList data={item} />,
    []
  );
  return (
    <View style={styles.page}>
      <FlatList
        style={styles.list}
        data={listData}
        initialNumToRender={listData.length}
        windowSize={10}
        maxToRenderPerBatch={5}
        keyExtractor={(item, idx) => item.emotionId?.toString() ?? idx.toString()}
        contentContainerStyle={[
          styles.scrollViewContent,
          isEmpty(listData) && styles.emptyContainer,
        ]}
        ListHeaderComponent={
          <EmotionDiaryListHeader
            showSkeleton={showSkeleton ?? false}
            diaryMode={diaryMode}
            selectedMonth={monthDate.toISOString()}
            monthData={monthData}
            calendarMode={calendarMode}
          />
        }
        ListEmptyComponent={<EmotionDiaryListEmpty showSkeleton={showSkeleton ?? false} />}
        renderItem={renderDiaryCard}
        scrollEnabled={scrollEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  list: {
    flex: 1,
  },
  page: {
    backgroundColor: colors.gray[100],
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    padding: 16,
  },
});

export default React.memo(EmotionDiaryMonthView);
