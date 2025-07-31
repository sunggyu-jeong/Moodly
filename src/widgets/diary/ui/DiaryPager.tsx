import { DiaryPageMode, DiaryPageModeType } from '@entities/calendar/diary.type';
import EmotionDiaryMonthView from '@features/calendar/ui/EmotionDiaryMonthView';
import { resetDiary, setSelectedMonth } from '@features/diary/model/diary.slice';
import EmotionDiaryMonthSelector from '@features/diary/ui/EmotionDiaryMonthSelector';
import { DIARY_ICONS } from '@shared/assets/images/diary';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { isNotEmpty } from '@shared/lib';
import colors from '@shared/styles/colors';
import DiaryToggle from '@shared/ui/elements/DiaryToggle';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import NavigationBar from '../../navigation-bar/ui/NavigationBar';
import { useDiaryDayData, useDiaryMonthData } from '../hooks';

const DiaryPager = () => {
  const [diaryMode, setDiaryMode] = useState<DiaryPageModeType>(DiaryPageMode.calendarMode);

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

  const toggleDiaryMode = useCallback(() => {
    setDiaryMode(prev =>
      prev === DiaryPageMode.listMode ? DiaryPageMode.calendarMode : DiaryPageMode.listMode
    );
  }, []);

  const monthSelector = useMemo(
    () => (
      <EmotionDiaryMonthSelector
        monthLabel={selectedMonth.format('M월')}
        onPressLeft={() => onChangeMonth('left')}
        onPressRight={() => onChangeMonth('right')}
      />
    ),
    [selectedMonth, onChangeMonth]
  );

  const leftComponents = useMemo(
    () => [
      {
        item: monthSelector,
        disabled: true,
      },
    ],
    [monthSelector]
  );

  const viewModeButton = useMemo(
    () => ({
      item: (
        <Image
          source={
            diaryMode === DiaryPageMode.calendarMode
              ? DIARY_ICONS.iconDiaryCalendar
              : DIARY_ICONS.iconDiaryList
          }
          className="w-6 h-6"
          resizeMode="stretch"
        />
      ),
      onPress: toggleDiaryMode,
    }),
    [diaryMode, toggleDiaryMode]
  );

  const actionButtons = useMemo(() => {
    const buttons = [];
    if (diaryMode === DiaryPageMode.calendarMode) {
      buttons.push({
        item: (
          <DiaryToggle
            isOn={true}
            texts={['주간', '월간']}
          />
        ),
        disabled: true,
      });
    }
    buttons.push(viewModeButton);
    return buttons;
  }, [diaryMode, viewModeButton]);

  return (
    <>
      <NavigationBar
        backgroundColor={colors.gray[100]}
        showBackButton={false}
        leftComponents={leftComponents}
        actionButtons={actionButtons}
      />

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={1}
        offscreenPageLimit={1}
        overdrag={false}
        onPageSelected={onPageSelected}
      >
        {/* 0: 이전 달 */}
        <EmotionDiaryMonthView
          key="prev"
          monthDate={prevMonth}
          listData={diaryMode === DiaryPageMode.calendarMode ? currentList : prevListData}
          monthData={prevMonthData ?? []}
          diaryMode={diaryMode}
          currentMonth={currentMonth}
          selectedMonth={selectedMonth}
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
          scrollEnabled={diaryMode !== DiaryPageMode.calendarMode && isNotEmpty(currentList)}
        />

        {/* 2: 다음 달 */}
        <EmotionDiaryMonthView
          key="next"
          monthDate={nextMonth}
          listData={diaryMode === DiaryPageMode.calendarMode ? currentList : nextListData}
          monthData={nextMonthData ?? []}
          diaryMode={diaryMode}
          currentMonth={currentMonth}
          selectedMonth={selectedMonth}
          scrollEnabled={isNotEmpty(nextListData)}
        />
      </PagerView>
    </>
  );
};

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
});

export default DiaryPager;
