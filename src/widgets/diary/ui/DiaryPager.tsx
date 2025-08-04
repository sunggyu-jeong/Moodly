import { DiaryPageMode, DiaryPageModeType } from '@entities/calendar/diary.type';
import { EmotionDiaryDTO } from '@entities/diary';
import EmotionDiaryMonthView from '@features/calendar/ui/EmotionDiaryMonthView';
import { moveMonth, resetDiary } from '@features/diary/model/diary.slice';
import EmotionDiaryMonthSelector from '@features/diary/ui/EmotionDiaryMonthSelector';
import { DIARY_ICONS } from '@shared/assets/images/diary';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { isNotEmpty } from '@shared/lib';
import colors from '@shared/styles/colors';
import DiaryToggle from '@shared/ui/elements/DiaryToggle';
import { NaviActionButtonProps } from '@shared/ui/elements/NaviActionButton';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import NavigationBar from '../../navigation-bar/ui/NavigationBar';
import { useDiaryDayData, useDiaryMonthData } from '../hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CalendarPage = {
  key: string;
  monthDate: dayjs.Dayjs;
  listData: EmotionDiaryDTO[];
  monthData: EmotionDiaryDTO[];
};

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

  /**
   * ------------------
   * MONTH CHANGE HANDLER (FlatList 기반)
   * ------------------
   */
  const flatListRef = useRef<FlatList<CalendarPage>>(null);
  const isScrollingRef = useRef(false); // 중복 month 이동 방지

  const calendarPages: CalendarPage[] = useMemo(
    () => [
      { key: 'prev', monthDate: prevMonth, listData: prevMonthData, monthData: prevMonthData },
      { key: 'current', monthDate: selectedMonth, listData: currentList, monthData: monthData },
      { key: 'next', monthDate: nextMonth, listData: nextMonthData, monthData: nextMonthData },
    ],
    [prevMonth, selectedMonth, nextMonth, prevMonthData, monthData, nextMonthData, currentList]
  );

  const scrollToMiddle = () => {
    flatListRef.current?.scrollToIndex({ index: 1, animated: false });
    isScrollingRef.current = false;
  };

  // 월이 외부 상태로 바뀌면 리스트를 중앙으로 리셋
  useEffect(() => {
    scrollToMiddle();
  }, [selectedMonthIso]);

  // 초기 한 번 중앙으로 세팅
  useEffect(() => {
    scrollToMiddle();
    dispatch(resetDiary());
  }, []);

  const onMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isScrollingRef.current) return; // 이미 처리 중이면 무시

      const offsetX = e.nativeEvent.contentOffset.x;
      const position = Math.round(offsetX / SCREEN_WIDTH);

      if (position === 1) return; // 중앙이면 아무 것도 안 함

      const dir = position === 0 ? 'left' : 'right';
      isScrollingRef.current = true;
      scrollToMiddle();
      dispatch(moveMonth(dir));
    },
    [dispatch]
  );

  const toggleDiaryMode = useCallback(() => {
    setDiaryMode(prev =>
      prev === DiaryPageMode.listMode ? DiaryPageMode.calendarMode : DiaryPageMode.listMode
    );
  }, []);

  /** UI 컴포넌트들 */
  const monthSelector = (
    <EmotionDiaryMonthSelector
      monthLabel={selectedMonth.format('M월')}
      onPressLeft={() => dispatch(moveMonth('left'))}
      onPressRight={() => dispatch(moveMonth('right'))}
    />
  );
  const leftComponents = [{ item: monthSelector, disabled: true }];
  const viewModeButton = {
    item: (
      <TouchableOpacity
        onPress={toggleDiaryMode}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
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

  /** FlatList 렌더 함수 */
  const renderPage = ({ item }: { item: CalendarPage }) => (
    <View style={{ width: SCREEN_WIDTH }}>
      <EmotionDiaryMonthView
        key={item.key}
        monthDate={item.monthDate}
        listData={currentList}
        monthData={item.monthData}
        diaryMode={diaryMode}
        currentMonth={currentMonth}
        selectedMonth={selectedMonth}
        scrollEnabled={isNotEmpty(item.monthData)}
      />
    </View>
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
        <FlatList
          ref={flatListRef}
          data={calendarPages}
          keyExtractor={item => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderPage}
          onMomentumScrollEnd={onMomentumEnd}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          initialScrollIndex={1}
          windowSize={3}
          style={styles.pager}
        />
      ) : (
        <EmotionDiaryMonthView
          key={`calendar-${selectedMonth.format('YYYY-MM')}`}
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
    width: '100%',
  },
});

export default DiaryPager;
