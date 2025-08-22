import type { DiaryCalendarModeType, DiaryPageModeType } from '@entities/calendar/diary.type';
import type { Diary } from '@entities/diary/model/diary.types';
import EmotionDiaryCardList from '@features/diary/ui/EmotionDiaryCardList';
import EmotionDiaryListEmpty from '@features/diary/ui/EmotionDiaryListEmpty';
import EmotionDiaryListHeader from '@features/diary/ui/EmotionDiaryListHeader';
import { useAppSelector } from '@shared';
import { isEmpty } from '@shared/lib';
import colors from '@shared/styles/colors';
import dayjs, { Dayjs } from 'dayjs';
import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { selectSelectedDayIso } from '../model';

interface EmotionDiaryMonthViewProps {
  monthDate: Dayjs;
  monthData: Diary[]; // Month summary DTO
  diaryMode: DiaryPageModeType;
  scrollEnabled: boolean;
  showSkeleton?: boolean;
  calendarMode?: DiaryCalendarModeType;
}

const EmotionDiaryMonthView = ({
  monthDate,
  monthData,
  diaryMode,
  scrollEnabled,
  showSkeleton,
  calendarMode,
}: EmotionDiaryMonthViewProps) => {
  const renderDiaryCard = useCallback(
    ({ item }: { item: Diary }) => <EmotionDiaryCardList data={item} />,
    [],
  );

  const selectedDayIso = useAppSelector(selectSelectedDayIso);

  const filteredListData = useMemo(() => {
    if (!selectedDayIso) {
      return monthData;
    }
    return monthData.filter(e => dayjs(e.recordDate).isSame(dayjs(selectedDayIso), 'day'));
  }, [monthData, selectedDayIso]);

  return (
    <View style={styles.page}>
      <FlatList
        style={styles.list}
        data={filteredListData}
        initialNumToRender={filteredListData?.length ?? 0}
        windowSize={10}
        maxToRenderPerBatch={5}
        keyExtractor={(item, idx) => item.emotionId?.toString() ?? idx.toString()}
        contentContainerStyle={[
          styles.scrollViewContent,
          isEmpty(filteredListData) && styles.emptyContainer,
        ]}
        ListHeaderComponent={
          <EmotionDiaryListHeader
            showSkeleton={showSkeleton ?? false}
            diaryMode={diaryMode}
            selectedMonth={monthDate.toString()}
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
