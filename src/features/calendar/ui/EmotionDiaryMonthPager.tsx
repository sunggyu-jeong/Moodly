import {
  DiaryCalendarModeType,
  DiaryPageMode,
  DiaryPageModeType,
} from '@entities/calendar/diary.type';
import { isNotEmpty } from '@shared/lib';
import { Dayjs } from 'dayjs';
import { useCallback, useRef, useState, type Ref } from 'react';
import { Dimensions, FlatList, FlatListProps, ListRenderItem, View, ViewToken } from 'react-native';
import { CalendarPage } from '../lib/paging';
import EmotionDiaryMonthView from './EmotionDiaryMonthView';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EmotionDiaryMonthPagerProps {
  data: CalendarPage[];
  diaryMode: DiaryPageModeType;
  calendarMode: DiaryCalendarModeType;
  currentMonth: Dayjs;
  selectedMonth: Dayjs;
  listModeFallback: React.ReactNode;
  flatListRef: Ref<FlatList<CalendarPage>>;
  onScroll?: FlatListProps<CalendarPage>['onScroll'];
  onMomentumScrollEnd?: FlatListProps<CalendarPage>['onMomentumScrollEnd'];
}

export const EmotionDiaryMonthPager = ({
  data,
  diaryMode,
  calendarMode,
  currentMonth,
  selectedMonth,
  listModeFallback,
  flatListRef,
  onScroll,
  onMomentumScrollEnd,
}: EmotionDiaryMonthPagerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChangedRef = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const renderPage: ListRenderItem<CalendarPage> = useCallback(
    ({ item, index }) => {
      const isActive = index === currentIndex;
      const isNeighbor = Math.abs(index - currentIndex) === 1;

      return (
        <View style={{ width: SCREEN_WIDTH }}>
          {isActive ? (
            <EmotionDiaryMonthView
              monthDate={item.periodStart}
              listData={item.currentItems}
              monthData={item.items}
              diaryMode={diaryMode}
              currentMonth={currentMonth}
              selectedMonth={selectedMonth}
              scrollEnabled={isNotEmpty(item.items)}
              calendarMode={calendarMode}
            />
          ) : isNeighbor ? (
            <EmotionDiaryMonthView
              monthDate={item.periodStart}
              listData={[]}
              monthData={[]}
              diaryMode={diaryMode}
              currentMonth={currentMonth}
              selectedMonth={selectedMonth}
              scrollEnabled={false}
              calendarMode={calendarMode}
            />
          ) : (
            <View className="flex-1" />
          )}
        </View>
      );
    },
    [calendarMode, currentMonth, diaryMode, selectedMonth, currentIndex]
  );

  if (diaryMode !== DiaryPageMode.calendarMode) return <>{listModeFallback}</>;

  return (
    <FlatList<CalendarPage>
      ref={flatListRef}
      data={data}
      horizontal
      pagingEnabled
      keyExtractor={it => it.key}
      renderItem={renderPage}
      initialNumToRender={1}
      maxToRenderPerBatch={1}
      updateCellsBatchingPeriod={80}
      windowSize={2}
      removeClippedSubviews
      getItemLayout={(_, i) => ({ length: SCREEN_WIDTH, offset: SCREEN_WIDTH * i, index: i })}
      initialScrollIndex={1}
      scrollEventThrottle={16}
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      onMomentumScrollEnd={onMomentumScrollEnd}
      viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
      onViewableItemsChanged={onViewableItemsChangedRef.current}
    />
  );
};
