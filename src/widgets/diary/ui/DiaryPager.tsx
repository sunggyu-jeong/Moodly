import {
  DiaryCalendarMode,
  DiaryCalendarModeType,
  DiaryPageMode,
  DiaryPageModeType,
} from '@entities/calendar/diary.type';
import { EmotionDiaryDTO } from '@entities/diary';
import EmotionDiaryMonthView from '@features/calendar/ui/EmotionDiaryMonthView';
import { moveMonth, moveWeek, resetDiary } from '@features/diary/model/diary.slice';
import EmotionDiaryMonthSelector from '@features/diary/ui/EmotionDiaryMonthSelector';
import { DIARY_ICONS } from '@shared/assets/images/diary';
import { useAppDispatch, useAppSelector } from '@shared/hooks';
import { isNotEmpty } from '@shared/lib';
import colors from '@shared/styles/colors';
import DiaryToggle from '@shared/ui/elements/DiaryToggle';
import { NaviActionButtonProps } from '@shared/ui/elements/NaviActionButton';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import NavigationBar from '../../navigation-bar/ui/NavigationBar';
import { useDiaryMonthData, useDiaryWeekData } from '../hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type CalendarPage = {
  key: string;
  periodStart: Dayjs;
  items: EmotionDiaryDTO[];
  currentItems?: EmotionDiaryDTO[] | [];
};

const DiaryPager = () => {
  const [diaryMode, setDiaryMode] = useState<DiaryPageModeType>(DiaryPageMode.calendarMode);
  const dispatch = useAppDispatch();
  const selectedMonthIso = useAppSelector(state => state.diarySlice.selectedMonth);
  const selectedWeekIso = useAppSelector(state => state.diarySlice.selectedWeek);
  const selectedDayIso = useAppSelector(state => state.diarySlice.selectedDay);

  const selectedMonth = useMemo(() => dayjs(selectedMonthIso), [selectedMonthIso]);
  const currentMonth = dayjs();
  const prevMonth = selectedMonth.add(-1, 'month');
  const nextMonth = selectedMonth.add(1, 'month');

  const selectedWeek = useMemo(() => dayjs(selectedWeekIso), [selectedWeekIso]);
  const [calendarMode, setCalendarMode] = useState<DiaryCalendarModeType>(
    DiaryCalendarMode.monthDayMode
  );
  const weekStarts = [selectedWeek.add(-1, 'week'), selectedWeek, selectedWeek.add(1, 'week')];

  const weekDataPrev = useDiaryWeekData(weekStarts[0]);
  const weekDataCurr = useDiaryWeekData(weekStarts[1]);
  const weekDataNext = useDiaryWeekData(weekStarts[2]);

  const { listData: prevMonthData } = useDiaryMonthData(prevMonth);
  const { listData: monthData } = useDiaryMonthData(selectedMonth);
  const { listData: nextMonthData } = useDiaryMonthData(nextMonth);

  useEffect(() => {
    const arr = monthData.filter(e =>
      dayjs.utc(e.createdAt).isSame(dayjs.utc(selectedDayIso), 'day')
    );
    console.log(arr);
  }, [selectedDayIso]);

  /**
   * ------------------
   * MONTH CHANGE HANDLER (FlatList 기반)
   * ------------------
   */
  const flatListRef = useRef<FlatList<CalendarPage>>(null);
  const isScrollingRef = useRef(false);

  const pages: CalendarPage[] = useMemo(() => {
    if (calendarMode === DiaryCalendarMode.monthDayMode) {
      return [
        { key: 'prev', periodStart: prevMonth, items: prevMonthData, currentItems: prevMonthData },
        {
          key: 'current',
          periodStart: selectedMonth,
          items: monthData,
          currentItems: isNotEmpty(selectedDayIso)
            ? monthData?.filter(e => dayjs.utc(e.createdAt).isSame(dayjs(selectedDayIso), 'day'))
            : monthData,
        },
        { key: 'next', periodStart: nextMonth, items: nextMonthData, currentItems: nextMonthData },
      ];
    } else {
      return [
        {
          key: 'prev',
          periodStart: weekStarts[0],
          items: weekDataPrev.listData,
          currentItems: weekDataPrev.listData,
        },
        {
          key: 'current',
          periodStart: weekStarts[1],
          items: weekDataCurr.listData,
          currentItems: isNotEmpty(selectedDayIso)
            ? weekDataCurr.listData.filter(e =>
                dayjs.utc(e.createdAt).isSame(dayjs(selectedDayIso), 'day')
              )
            : weekDataCurr.listData,
        },
        {
          key: 'next',
          periodStart: weekStarts[2],
          items: weekDataNext.listData,
          currentItems: weekDataNext.listData,
        },
      ];
    }
  }, [
    calendarMode,
    prevMonthData,
    monthData,
    nextMonthData,
    selectedMonth,
    prevMonth,
    nextMonth,
    weekDataPrev,
    weekDataCurr,
    weekDataNext,
    weekStarts,
  ]);

  useEffect(() => {
    console.log('>$@!$>>$$!>@', pages, selectedDayIso);
  }, [pages]);

  const scrollToMiddle = () => {
    flatListRef.current?.scrollToIndex({ index: 1, animated: false });
  };

  // 월이 외부 상태로 바뀌면 리스트를 중앙으로 리셋
  useEffect(() => {
    scrollToMiddle();
  }, [selectedMonthIso]);

  // 초기 한 번 중앙으로 세팅
  useEffect(() => {
    scrollToMiddle();
    dispatch(resetDiary());
  }, [dispatch]);

  const onMomentumEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // 스크롤 완료 시 중복 이동 방어 해제
    isScrollingRef.current = false;
  }, []);

  function formatWeekLabel(weekStart: Dayjs): string {
    const month = weekStart.month() + 1;
    const firstOfMonth = weekStart.startOf('month');
    const firstWeekStart = firstOfMonth.startOf('week');
    const weekIndex = weekStart.diff(firstWeekStart, 'week') + 1;

    return `${month}월 ${weekIndex}째주`;
  }

  const onScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isScrollingRef.current) return;
      const offsetX = nativeEvent.contentOffset.x;
      const ratio = offsetX / SCREEN_WIDTH;
      if (ratio <= 0.3) {
        isScrollingRef.current = true;
        scrollToMiddle();
        if (calendarMode === DiaryCalendarMode.monthDayMode) {
          dispatch(moveMonth('left'));
        } else {
          dispatch(moveWeek('left'));
        }
      } else if (ratio >= 1.7) {
        isScrollingRef.current = true;
        scrollToMiddle();
        if (calendarMode === DiaryCalendarMode.monthDayMode) {
          dispatch(moveMonth('right'));
        } else {
          dispatch(moveWeek('right'));
        }
      }
    },
    [dispatch, calendarMode]
  );

  const toggleDiaryMode = useCallback(() => {
    setDiaryMode(prev =>
      prev === DiaryPageMode.listMode ? DiaryPageMode.calendarMode : DiaryPageMode.listMode
    );
  }, []);

  /** UI 컴포넌트들 */
  const monthSelector = (
    <EmotionDiaryMonthSelector
      monthLabel={
        calendarMode === DiaryCalendarMode.monthDayMode
          ? selectedMonth.format('M월')
          : formatWeekLabel(selectedWeek)
      }
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
                isOn={calendarMode === DiaryCalendarMode.monthDayMode}
                texts={['주간', '월간']}
                onToggle={() =>
                  setCalendarMode(c =>
                    c === DiaryCalendarMode.monthDayMode
                      ? DiaryCalendarMode.weekDayMode
                      : DiaryCalendarMode.monthDayMode
                  )
                }
              />
            ),
            disabled: true,
          },
        ]
      : []),
    viewModeButton,
  ];

  const renderPage: ListRenderItem<CalendarPage> = ({ item }) => (
    <View
      key={item.key}
      style={{ width: SCREEN_WIDTH }}
    >
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
          data={pages}
          keyExtractor={item => item.key}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderPage}
          scrollEventThrottle={16}
          onScroll={onScroll}
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
          listData={monthData}
          monthData={monthData}
          diaryMode={diaryMode}
          currentMonth={currentMonth}
          selectedMonth={selectedMonth}
          scrollEnabled={isNotEmpty(monthData)}
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
