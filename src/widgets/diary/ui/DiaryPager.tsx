import { DiaryCalendarMode, DiaryPageMode } from '@entities/calendar/diary.type';
import { CalendarPage } from '@features/calendar/lib/paging';
import { useDiaryPagerVM } from '@features/calendar/model/useDiaryPagerVM';
import { usePagerController } from '@features/calendar/model/usePagerController';
import { EmotionDiaryMonthPager } from '@features/calendar/ui/EmotionDiaryMonthPager';
import EmotionDiaryMonthView from '@features/calendar/ui/EmotionDiaryMonthView';
import EmotionDiaryMonthSelector from '@features/diary/ui/EmotionDiaryMonthSelector';
import { DIARY_ICONS } from '@shared/assets/images/diary';
import { isNotEmpty } from '@shared/lib';
import colors from '@shared/styles/colors';
import DiaryToggle from '@shared/ui/elements/DiaryToggle';
import { useEffect } from 'react';
import { Image, TouchableOpacity } from 'react-native';

import NavigationBar from '../../navigation-bar/ui/NavigationBar';

export const DiaryPager = () => {
  const {
    diaryMode,
    calendarMode,
    selectedMonth,
    currentMonth,
    selectedMonthIso,
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
  }, [selectedMonthIso, scrollToMiddle]);

  useEffect(() => {
    scrollToMiddle(false);
    reset();
  }, [reset, scrollToMiddle]);

  const monthSelector = (
    <EmotionDiaryMonthSelector
      monthLabel={monthLabel}
      onPressLeft={goLeft}
      onPressRight={goRight}
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

  const actionButtons = [
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
    viewModeButton,
  ];

  return (
    <>
      <NavigationBar
        backgroundColor={colors.gray[100]}
        showBackButton={false}
        leftComponents={leftComponents}
        actionButtons={actionButtons}
      />
      <EmotionDiaryMonthPager
        data={pages}
        diaryMode={diaryMode}
        calendarMode={calendarMode}
        currentMonth={currentMonth}
        selectedMonth={selectedMonth}
        flatListRef={flatListRef}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        listModeFallback={
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
        }
      />
    </>
  );
};
