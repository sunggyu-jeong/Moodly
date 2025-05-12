import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import NavigationBar from '@widgets/navigation-bar/ui/NavigationBar';

import {
  searchDiaryByMonthThunk,
  setSelectedMonth,
} from '@/features/diary/model/diary.slice';
import { useAppDispatch, useAppSelector, useRealm } from '@/shared/hooks';
import { isEmpty, isNotEmpty } from '@/shared/lib';
import colors from '@/shared/styles/colors';

import DiaryCardList from '../components/DiaryCardList';
import DiaryEmptyMent from '../components/DiaryEmptyMent';
import DiaryMonth from '../components/DiaryMonth';

const DiaryList = () => {
  const { openRealm, closeRealm } = useRealm();
  const selectedMonth = useAppSelector(state => state.diarySlice.selectedMonth);
  const searchByMonth = useAppSelector(state => state.diarySlice.searchByMonth);
  const currentMonth = dayjs();
  const dispatch = useAppDispatch();

  const handleChangeMonth = (direction: 'left' | 'right') => {
    dispatch(
      setSelectedMonth(
        dayjs(selectedMonth)
          .add(direction === 'left' ? -1 : 1, 'month')
          .toISOString()
      )
    );
  };

  const initialize = useCallback(async () => {
    const realm = await openRealm();
    if (isNotEmpty(realm)) {
      await dispatch(
        searchDiaryByMonthThunk({ realm, recordDate: new Date(selectedMonth) })
      );
      closeRealm();
    }
  }, [openRealm, dispatch, selectedMonth, closeRealm]);

  useFocusEffect(
    useCallback(() => {
      initialize();
    }, [initialize])
  );

  return (
    <>
      <NavigationBar
        backgroundColor={colors.gray[100]}
        showBackButton={false}
        centerComponent={
          <DiaryMonth
            monthLabel={dayjs(selectedMonth).format('M월')}
            onPressLeft={() => {
              handleChangeMonth('left');
            }}
            onPressRight={() => {
              handleChangeMonth('right');
            }}
            rightDisabled={
              currentMonth.isSame(dayjs(selectedMonth), 'month') ? true : false
            }
          />
        }
      />
      {isNotEmpty(searchByMonth?.data) && (
        <ScrollView
          className="bg-gray-100"
          contentContainerStyle={styles.scrollViewContent}
        >
          <DiaryCardList />
        </ScrollView>
      )}

      {isEmpty(searchByMonth?.data) && <DiaryEmptyMent />}
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: 24,
  },
});

export default DiaryList;
