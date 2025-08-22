import { DiaryCalendarMode, DiaryPageMode } from '@entities/calendar/diary.type';
import type { CalendarPage } from '@features/calendar/lib/paging';
import { useDiaryPagerVM } from '@features/calendar/model/useDiaryPagerVM';
import { usePagerController } from '@features/calendar/model/usePagerController';
import { EmotionDiaryMonthPager } from '@features/calendar/ui/EmotionDiaryMonthPager';
import EmotionDiaryMonthView from '@features/calendar/ui/EmotionDiaryMonthView';
import EmotionDiaryMonthSelector from '@features/diary/ui/EmotionDiaryMonthSelector';
import { DIARY_ICONS } from '@shared/assets/images/diary';
import { isNotEmpty } from '@shared/lib';
import colors from '@shared/styles/colors';
import DiaryToggle from '@shared/ui/elements/DiaryToggle';
import { useEffect, useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { NavigationBar } from '@/widgets/navigation-bar';

export const DiaryPager = () => {
  const {
    diaryMode,
    calendarMode,
    selectedMonth,
    currentMonth,
    monthData,
    pages,
    monthLabel,
    goLeft,
    goRight,
    toggleDiaryMode,
    toggleCalendarMode,
    reset,
  } = useDiaryPagerVM();
  const { flatListRef, onScroll, onMomentumScrollEnd, scrollToMiddle } =
    usePagerController<CalendarPage>({
      onLeft: goLeft,
      onRight: goRight,
    });

  useEffect(() => {
    scrollToMiddle(false);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leftComponents = useMemo(
    () => [
      {
        item: (
          <EmotionDiaryMonthSelector
            monthLabel={monthLabel}
            onPressLeft={goLeft}
            onPressRight={goRight}
          />
        ),
        disabled: true,
      },
    ],
    [goLeft, goRight, monthLabel],
  );

  const actionButtons = useMemo(
    () => [
      ...(diaryMode === DiaryPageMode.calendarMode
        ? [
            {
              item: (
                <DiaryToggle
                  isOn={calendarMode === DiaryCalendarMode.monthDayMode}
                  texts={['주간', '월간']}
                  onToggle={toggleCalendarMode}
                />
              ),
              disabled: true,
            },
          ]
        : []),
      {
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
      },
    ],
    [calendarMode, diaryMode, toggleCalendarMode, toggleDiaryMode],
  );

  const isCalendarMode = diaryMode === DiaryPageMode.calendarMode;

  return (
    <>
      <NavigationBar
        backgroundColor={colors.gray[100]}
        showBackButton={false}
        leftComponents={leftComponents}
        actionButtons={actionButtons}
      />
      <View style={styles.container}>
        {/* 캘린더 뷰: isCalendarMode가 아닐 때 숨김 */}
        <View style={!isCalendarMode ? styles.hidden : styles.visible}>
          <EmotionDiaryMonthPager
            data={pages}
            diaryMode={diaryMode}
            calendarMode={calendarMode}
            currentMonth={currentMonth}
            selectedMonth={selectedMonth}
            flatListRef={flatListRef}
            onScroll={onScroll}
            onMomentumScrollEnd={onMomentumScrollEnd}
          />
        </View>

        {/* 리스트 뷰: isCalendarMode일 때 숨김 */}
        <View style={isCalendarMode ? styles.hidden : styles.visible}>
          <EmotionDiaryMonthView
            key={`list-${selectedMonth.format('YYYY-MM')}`}
            monthDate={selectedMonth}
            monthData={monthData}
            diaryMode={diaryMode}
            currentMonth={currentMonth}
            selectedMonth={selectedMonth}
            scrollEnabled={isNotEmpty(monthData)}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
  visible: {
    flex: 1,
  },
});
