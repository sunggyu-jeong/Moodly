import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { DiaryPageMode, DiaryPageModeType } from '../../../entities/calendar/diary.type';
import EmotionDiaryMonthView from '../../../features/calendar/ui/EmotionDiaryMonthView';
import { resetDiary, setSelectedMonth } from '../../../features/diary/model/diary.slice';
import EmotionDiaryMonthSelector from '../../../features/diary/ui/EmotionDiaryMonthSelector';
import { DIARY_ICONS } from '../../../shared/assets/images/diary';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { isNotEmpty } from '../../../shared/lib';
import colors from '../../../shared/styles/colors';
import DiaryToggle from '../../../shared/ui/elements/DiaryToggle';
import { NaviActionButtonProps } from '../../../shared/ui/elements/NaviActionButton';
import NavigationBar from '../../navigation-bar/ui/NavigationBar';
import { useDiaryDayData, useDiaryMonthData } from '../hooks';

const DiaryPager = () => {
  const [diaryMode, setDiaryMode] = useState<DiaryPageModeType>(DiaryPageMode.calendarMode);
  const dispatch = useAppDispatch();
  const selectedMonthIso = useAppSelector(state => state.diarySlice.selectedMonth);
  const selectedDayIso = useAppSelector(state => state.diarySlice.selectedDay);

  const selectedMonth = useMemo(() => dayjs(selectedMonthIso), [selectedMonthIso]);
  const currentMonth = dayjs();
  const prevMonth = selectedMonth.add(-1, 'month');
  const nextMonth = selectedMonth.add(1, 'month');

  const { listData: prevMonthData } = useDiaryMonthData(prevMonth);
  const { listData: monthData } = useDiaryMonthData(selectedMonth);
  const { listData: nextMonthData } = useDiaryMonthData(nextMonth);
  const { listData: dayListData } = useDiaryDayData(
    selectedDayIso,
    diaryMode === DiaryPageMode.calendarMode
  );
  const currentList = diaryMode === DiaryPageMode.calendarMode ? dayListData : monthData;

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

  const monthSelector = (
    <EmotionDiaryMonthSelector
      monthLabel={selectedMonth.format('M월')}
      onPressLeft={() => onChangeMonth('left')}
      onPressRight={() => onChangeMonth('right')}
    />
  );

  const leftComponents = [{ item: monthSelector, disabled: true }];
  const viewModeButton = {
    item: (
      <TouchableOpacity onPress={toggleDiaryMode}>
        <Image
          source={
            diaryMode === DiaryPageMode.calendarMode
              ? DIARY_ICONS.iconDiaryCalendar
              : DIARY_ICONS.iconDiaryList
          }
          className="w-6 h-6"
          resizeMode="stretch"
        />
      </TouchableOpacity>
    ),
  };
  const actionButtons: NaviActionButtonProps[] = [
    ...(diaryMode === DiaryPageMode.calendarMode
      ? [
          {
            item: (
              <DiaryToggle
                isOn
                texts={['주간', '월간']}
              />
            ),
            disabled: true,
          },
        ]
      : []),
    viewModeButton,
  ];
  const calendarPages = useMemo(
    () => [
      { key: 'prev', monthDate: prevMonth, listData: currentList, monthData: prevMonthData },
      { key: 'current', monthDate: selectedMonth, listData: currentList, monthData: monthData },
      { key: 'next', monthDate: nextMonth, listData: currentList, monthData: nextMonthData },
    ],
    [prevMonth, selectedMonth, nextMonth, prevMonthData, monthData, nextMonthData, currentList]
  );

  return (
    <>
      <NavigationBar
        backgroundColor={colors.gray[100]}
        showBackButton={false}
        leftComponents={leftComponents}
        actionButtons={actionButtons}
      />

      {diaryMode === DiaryPageMode.calendarMode ? (
        <PagerView
          ref={pagerRef}
          style={styles.pager}
          initialPage={1}
          offscreenPageLimit={1}
          overdrag={false}
          onPageSelected={onPageSelected}
        >
          {calendarPages.map(({ key, monthDate, listData, monthData }) => (
            <EmotionDiaryMonthView
              key={key}
              monthDate={monthDate}
              listData={listData}
              monthData={monthData}
              diaryMode={diaryMode}
              currentMonth={currentMonth}
              selectedMonth={selectedMonth}
              scrollEnabled={isNotEmpty(monthData)}
            />
          ))}
        </PagerView>
      ) : (
        <EmotionDiaryMonthView
          key="current"
          monthDate={selectedMonth}
          listData={currentList}
          monthData={monthData}
          diaryMode={diaryMode}
          currentMonth={currentMonth}
          selectedMonth={selectedMonth}
          scrollEnabled={isNotEmpty(currentList)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  pager: {
    flex: 1,
  },
});

export default DiaryPager;
