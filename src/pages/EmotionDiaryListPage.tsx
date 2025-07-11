import dayjs from 'dayjs';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import NavigationBar from '@widgets/navigation-bar/ui/NavigationBar.tsx';

import { setSelectedMonth } from '@features/diary/model/diary.slice.ts';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import colors from '@shared/styles/colors.ts';

import EmotionDiaryEmptyMessage from '@features/diary/ui/EmotionDiaryEmptyMessage.tsx';
import EmotionDiaryMonthSelector from '@features/diary/ui/EmotionDiaryMonthSelector.tsx';
import DiarySkeleton from '@features/diary/ui/skeleton/DiaryCardSkeleton';
import { useSelectByMonthQuery } from '@shared/api/diary/diaryApi';
import useDelay from '@shared/hooks/useDelay';
import EmotionDiaryCardList from '../features/diary/ui/EmotionDiaryCardList';
import { isEmpty, isNotEmpty } from '../shared/lib';

const EmotionDiaryListPage = () => {
  const selectedMonth = useAppSelector(state => state.diarySlice.selectedMonth);
  const currentMonth = dayjs();
  const dispatch = useAppDispatch();
  const month = useMemo(
    () => ({
      start: dayjs(selectedMonth).startOf('month').toISOString(),
      end: dayjs(selectedMonth).add(1, 'month').startOf('month').toISOString(),
    }),
    [selectedMonth]
  );
  const { data, isFetching } = useSelectByMonthQuery(month);
  const showSkeleton = useDelay(isFetching);

  const handleChangeMonth = (direction: 'left' | 'right') => {
    dispatch(
      setSelectedMonth(
        dayjs(selectedMonth)
          .add(direction === 'left' ? -1 : 1, 'month')
          .toISOString()
      )
    );
  };

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
            leftDisabled={showSkeleton || false}
            rightDisabled={
              showSkeleton || currentMonth.isSame(dayjs(selectedMonth), 'month') ? true : false
            }
          />
        }
      />
      <FlatList
        className="bg-gray-100"
        data={showSkeleton ? [] : data}
        keyExtractor={(item, index) => item.emotionId?.toString() ?? index.toString()}
        contentContainerStyle={[styles.scrollViewContent, isEmpty(data) && styles.emptyContainer]}
        // 데이터 페칭 중일 때 스켈레톤 화면 표출
        ListHeaderComponent={() => {
          return showSkeleton || showSkeleton === null ? <DiarySkeleton /> : null;
        }}
        // 빈 상태: 스켈레톤이 끝나고 데이터가 없을 때
        ListEmptyComponent={() =>
          !showSkeleton && (
            <View style={styles.emptyContainer}>
              <EmotionDiaryEmptyMessage />
            </View>
          )
        }
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
    flex: 1,
    justifyContent: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
});

export default EmotionDiaryListPage;
