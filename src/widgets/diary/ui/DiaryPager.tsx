import { DiaryPageMode, DiaryPageModeType } from '@entities/calendar/diary.type';
import EmotionDiaryMonthView from '@features/calendar/ui/EmotionDiaryMonthView';
import { resetDiary, setSelectedMonth } from '@features/diary/model/diary.slice';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { isEmpty, isNotEmpty } from '@shared/lib';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { useDiaryDayData, useDiaryMonthData } from '../hooks';

const DiaryPager = () => {
  const [diaryMode] = useState<DiaryPageModeType>(DiaryPageMode.calendarMode);

  const dispatch = useAppDispatch();
  const selectedMonthIso = useAppSelector(state => state.diarySlice.selectedMonth);
  const selectedDayIso = useAppSelector(state => state.diarySlice.selectedDay);

  const selectedMonth = useMemo(() => dayjs(selectedMonthIso), [selectedMonthIso]);
  const currentMonth = dayjs();
  const prevMonth = useMemo(() => selectedMonth.add(-1, 'month'), [selectedMonth]);
  const nextMonth = useMemo(() => selectedMonth.add(1, 'month'), [selectedMonth]);

  const { data: prevMonthData, listData: prevListData } = useDiaryMonthData(prevMonth);
  const { data, listData } = useDiaryMonthData(selectedMonth);
  const { data: nextMonthData, listData: nextListData } = useDiaryMonthData(nextMonth);

  const { listData: dayListData } = useDiaryDayData(
    selectedDayIso,
    diaryMode === DiaryPageMode.calendarMode
  );

  const currentList = diaryMode === DiaryPageMode.calendarMode ? dayListData : listData;
  useEffect(() => {
    console.log('>141241241', dayListData);
  }, [dayListData]);

  const onChangeMonth = useCallback(
    (dir: 'left' | 'right') => {
      const nextIso = selectedMonth.add(dir === 'left' ? -1 : 1, 'month').toISOString();
      dispatch(setSelectedMonth(nextIso));
    },
    [dispatch, selectedMonth]
  );

  const pagerRef = useRef<PagerView>(null);

  const onPageSelected = useCallback(
    (e: PagerViewOnPageSelectedEvent) => {
      const idx = e.nativeEvent.position;
      if (idx === 0) onChangeMonth('left');
      if (idx === 2) onChangeMonth('right');
    },
    [onChangeMonth]
  );

  useEffect(() => {
    pagerRef.current?.setPageWithoutAnimation(1);
  }, [selectedMonthIso]);

  useEffect(() => {
    dispatch(resetDiary());
  }, [dispatch]);

  return (
    <PagerView
      ref={pagerRef}
      style={styles.pager}
      initialPage={1}
      offscreenPageLimit={2}
      onPageSelected={onPageSelected}
    >
      {/* 0: 이전 달 */}
      <EmotionDiaryMonthView
        key="prev"
        monthDate={prevMonth}
        listData={prevListData}
        monthData={prevMonthData ?? []}
        diaryMode={diaryMode}
        currentMonth={currentMonth}
        selectedMonth={selectedMonth}
        onChangeMonth={onChangeMonth}
        disableLeft={false}
        disableRight
        scrollEnabled={isNotEmpty(prevListData)}
      />

      {/* 1: 현재 선택 달 */}
      <EmotionDiaryMonthView
        key="current"
        monthDate={selectedMonth}
        listData={currentList}
        monthData={data ?? []}
        diaryMode={diaryMode}
        currentMonth={currentMonth}
        selectedMonth={selectedMonth}
        onChangeMonth={onChangeMonth}
        disableLeft={diaryMode !== DiaryPageMode.calendarMode && isEmpty(currentList)}
        disableRight={currentMonth.isSame(selectedMonth, 'month')}
        scrollEnabled={diaryMode !== DiaryPageMode.calendarMode && isNotEmpty(currentList)}
      />

      {/* 2: 다음 달 */}
      <EmotionDiaryMonthView
        key="next"
        monthDate={nextMonth}
        listData={nextListData}
        monthData={nextMonthData ?? []}
        diaryMode={diaryMode}
        currentMonth={currentMonth}
        selectedMonth={selectedMonth}
        onChangeMonth={onChangeMonth}
        disableLeft
        disableRight={currentMonth.isSame(nextMonth, 'month')}
        scrollEnabled={isNotEmpty(nextListData)}
      />
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
});
export default DiaryPager;
