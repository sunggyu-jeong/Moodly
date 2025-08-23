import { DiaryCalendarMode, DiaryPageMode } from '@entities/calendar/diary.type';
import type { CalendarPage } from '@features/calendar/lib/paging';
import { useDiaryPagerVM } from '@features/calendar/model/useDiaryPagerVM';
import { usePagerController } from '@features/calendar/model/usePagerController';
import { EmotionDiaryMonthPager } from '@features/calendar/ui/EmotionDiaryMonthPager';
import EmotionDiaryMonthSelector from '@features/diary/ui/EmotionDiaryMonthSelector';
import { DIARY_ICONS } from '@shared/assets/images/diary';
import colors from '@shared/styles/colors';
import DiaryToggle from '@shared/ui/elements/DiaryToggle';
import { NavigationBar } from '@widgets/navigation-bar';
import { useEffect, useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export const DiaryPager = () => {
  const {
    diaryMode,
    calendarMode,
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
        <EmotionDiaryMonthPager
          data={pages}
          diaryMode={diaryMode}
          calendarMode={calendarMode}
          flatListRef={flatListRef}
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumScrollEnd}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
