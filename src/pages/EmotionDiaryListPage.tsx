import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import NavigationBar from '@widgets/navigation-bar/ui/NavigationBar.tsx';

import { searchDiaryByMonthThunk, setSelectedMonth } from '@features/diary/model/diary.slice.ts';
import { useAppDispatch, useAppSelector, useRealm } from '@shared/hooks';
import { isEmpty, isNotEmpty } from '@shared/lib';
import colors from '@shared/styles/colors.ts';

import EmotionDiaryCardList from '@features/diary/ui/EmotionDiaryCardList.tsx';
import EmotionDiaryEmptyMessage from '@features/diary/ui/EmotionDiaryEmptyMessage.tsx';
import EmotionDiaryMonthSelector from '@features/diary/ui/EmotionDiaryMonthSelector.tsx';
import { setShowToastView } from '@processes/overlay/model/overlay.slice';
import type Realm from 'realm';

const SKELETON_MIN_DURATION_MS = 700;

const EmotionDiaryListPage = () => {
  const { openRealm, closeRealm } = useRealm();
  const selectedMonth = useAppSelector(state => state.diarySlice.selectedMonth);
  const searchByMonth = useAppSelector(state => state.diarySlice.searchByMonth);
  const isLogin = useAppSelector(state => state.authSlice.isLogin);
  const currentMonth = dayjs();
  const dispatch = useAppDispatch();
  const [skeletonVisible, setSkeletonVisible] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    startTimeRef.current = Date.now();
    setSkeletonVisible(true);
    try {
      let realm: Realm | undefined;
      if (!isLogin) {
        realm = await openRealm();
      }

      await dispatch(
        searchDiaryByMonthThunk({ realm, recordDate: new Date(selectedMonth), isLogin })
      ).unwrap();
    } catch (error) {
      setShowToastView({ visibility: true, message: error as string });
    } finally {
      if (!isLogin) {
        closeRealm();
      }
      const now = Date.now();
      const elapsed = startTimeRef.current ? now - startTimeRef.current : SKELETON_MIN_DURATION_MS;
      const remaining = SKELETON_MIN_DURATION_MS - elapsed;

      if (remaining <= 0) {
        setSkeletonVisible(false);
      } else {
        timeoutRef.current = setTimeout(() => {
          setSkeletonVisible(false);
        }, remaining);
      }
    }
  }, [selectedMonth, openRealm, closeRealm, dispatch, isLogin]);

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
          <EmotionDiaryMonthSelector
            monthLabel={dayjs(selectedMonth).format('M월')}
            onPressLeft={() => {
              handleChangeMonth('left');
            }}
            onPressRight={() => {
              handleChangeMonth('right');
            }}
            rightDisabled={currentMonth.isSame(dayjs(selectedMonth), 'month') ? true : false}
          />
        }
      />
      {isNotEmpty(searchByMonth?.data) && (
        <ScrollView
          className="bg-gray-100"
          contentContainerStyle={styles.scrollViewContent}
        >
          {skeletonVisible && <DiarySkeleton />}
          {!skeletonVisible && <EmotionDiaryCardList />}
        </ScrollView>
      )}

      {isEmpty(searchByMonth?.data) && <EmotionDiaryEmptyMessage />}
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    paddingHorizontal: 24,
  },
});

export default EmotionDiaryListPage;
