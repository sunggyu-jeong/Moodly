import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import NavigationBar from '@widgets/navigation-bar/ui/NavigationBar.tsx';

import { setSelectedMonth } from '@features/diary/model/diary.slice.ts';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { isEmpty, isNotEmpty } from '@shared/lib';
import colors from '@shared/styles/colors.ts';

import EmotionDiaryEmptyMessage from '@features/diary/ui/EmotionDiaryEmptyMessage.tsx';
import EmotionDiaryMonthSelector from '@features/diary/ui/EmotionDiaryMonthSelector.tsx';
import DiarySkeleton from '@features/diary/ui/skeleton/DiaryCardSkeleton';
import { useSelectByMonthQuery } from '@shared/api/diary/diaryApi';
import useDelay from '@shared/hooks/useDelay';
import EmotionDiaryCardList from '../features/diary/ui/EmotionDiaryCardList';

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
  const { data, isFetching, refetch } = useSelectByMonthQuery(month);
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

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
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
            leftDisabled={showSkeleton || false}
            rightDisabled={
              showSkeleton || currentMonth.isSame(dayjs(selectedMonth), 'month') ? true : false
            }
          />
        }
      />
      <ScrollView
        className="bg-gray-100"
        contentContainerStyle={[styles.scrollViewContent]}
        scrollEnabled={!showSkeleton}
      >
        {(showSkeleton || showSkeleton === null) && <DiarySkeleton />}
        {!showSkeleton && isNotEmpty(data) && <EmotionDiaryCardList data={data} />}
        {isEmpty(data) && showSkeleton !== null && !showSkeleton && (
          <View style={styles.emptyContainer}>
            <EmotionDiaryEmptyMessage />
          </View>
        )}
      </ScrollView>
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
