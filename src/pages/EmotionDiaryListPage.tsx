import { DiaryPageMode, DiaryPageModeType } from '@entities/calendar/diary.type';
import { resetDiary, setSelectedMonth } from '@features/diary/model/diary.slice.ts';
import EmotionDiaryCardList from '@features/diary/ui/EmotionDiaryCardList';
import EmotionDiaryListEmpty from '@features/diary/ui/EmotionDiaryListEmpty';
import EmotionDiaryListHeader from '@features/diary/ui/EmotionDiaryListHeader';
import EmotionDiaryMonthSelector from '@features/diary/ui/EmotionDiaryMonthSelector.tsx';
import { useFocusEffect } from '@react-navigation/native';
import { useSelectByDayQuery, useSelectByMonthQuery } from '@shared/api/diary/diaryApi';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import useDelay from '@shared/hooks/useDelay';
import { isEmpty, isNotEmpty } from '@shared/lib';
import colors from '@shared/styles/colors.ts';
import NavigationBar from '@widgets/navigation-bar/ui/NavigationBar.tsx';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

const EmotionDiaryListPage = () => {
  const [diaryMode, setDiaryMode] = useState<DiaryPageModeType>(DiaryPageMode.calendarMode);
  const selectedMonth = useAppSelector(state => state.diarySlice.selectedMonth);
  const selectedDayStr = useAppSelector(state => state.diarySlice.selectedDay);
  const currentMonth = dayjs();
  const isCalendarMode = diaryMode === DiaryPageMode.calendarMode;
  const dispatch = useAppDispatch();
  const monthRange = useMemo(
    () => ({
      start: dayjs(selectedMonth).startOf('month').toISOString(),
      end: dayjs(selectedMonth).add(1, 'month').startOf('month').toISOString(),
    }),
    [selectedMonth]
  );
  const { data: monthData, isFetching: isMonthFetching } = useSelectByMonthQuery(monthRange);
  const { data: dayData, isFetching: isDayFetching } = useSelectByDayQuery(selectedDayStr, {
    skip: !isCalendarMode,
  });
  const data = isCalendarMode ? dayData : monthData;
  const isFetching = isCalendarMode ? isDayFetching : isMonthFetching;
  const isDelayElapsed = useDelay(isFetching);
  const showSkeleton = !isCalendarMode && isDelayElapsed;

  useFocusEffect(
    useCallback(() => {
      dispatch(resetDiary());
    }, [dispatch])
  );

  const listData = useMemo(() => {
    if (showSkeleton) return [];
    if (isCalendarMode) return dayData ? [dayData] : [];
    return monthData ?? [];
  }, [showSkeleton, isCalendarMode, dayData, monthData]);

  const handleChangeMonth = useCallback(
    (direction: 'left' | 'right') => {
      dispatch(
        setSelectedMonth(
          dayjs(selectedMonth)
            .add(direction === 'left' ? -1 : 1, 'month')
            .toISOString()
        )
      );
    },
    [dispatch, selectedMonth]
  );

  return (
    <>
      <NavigationBar
        backgroundColor={colors.gray[100]}
        showBackButton={false}
        centerComponent={
          <EmotionDiaryMonthSelector
            monthLabel={dayjs(selectedMonth).format('M월')}
            onPressLeft={() => {
              handleChangeMonth('left');
            }}
            onPressRight={() => {
              handleChangeMonth('right');
            }}
            leftDisabled={showSkeleton ?? false}
            rightDisabled={showSkeleton || currentMonth.isSame(dayjs(selectedMonth), 'month')}
          />
        }
      />
      <FlatList
        className="bg-gray-100"
        data={listData}
        keyExtractor={(item, index) => item.emotionId?.toString() ?? index.toString()}
        contentContainerStyle={[styles.scrollViewContent, isEmpty(data) && styles.emptyContainer]}
        // 데이터 페칭 중일 때 스켈레톤 화면 표출
        // 패칭 완료 시 캘린더 뷰일경우, 캘린더정보 표출
        ListHeaderComponent={
          <EmotionDiaryListHeader
            showSkeleton={showSkeleton ?? false}
            diaryMode={diaryMode}
            selectedMonth={selectedMonth}
            monthData={monthData}
          />
        }
        // 빈 상태: 스켈레톤이 끝나고 데이터가 없을 때
        ListEmptyComponent={<EmotionDiaryListEmpty showSkeleton={showSkeleton ?? false} />}
        renderItem={({ item }) => <EmotionDiaryCardList data={item} />}
        // 스크롤 잠금: 페칭 중일 때나 데이터가 없을 때
        scrollEnabled={!showSkeleton && isNotEmpty(data)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
});

export default EmotionDiaryListPage;
